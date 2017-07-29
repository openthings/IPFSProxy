var Web3 = require('web3');
var ipfsAPI = require('ipfs-api');
var config = require('./config.json');

var ipfs = ipfsAPI(config.ipfsapi);
var web3 = new Web3(new Web3.providers.HttpProvider(config.web3host));

var contract = web3.eth.contract(config.IPFSProxyAbi).at(config.contractaddress);

var ipfsProxyEvents = contract.allEvents({
  fromBlock: config.startblock,
  toBlock: 'latest'
});

console.log("Currently at block=" + web3.eth.blockNumber);

var memberquota = {};
var hashvalidity = {};
var epochtohash = {};
var watchedcontracts = {};

contract.sizeLimit(function(err, res) {
  if (err) {
    process.exit();
  }
  var sizelimit = res.toNumber(10);
  console.log('sizelimit=', sizelimit);

  var listener = ipfsProxyEvents.watch(function(error, result) {
    if (error == null) {
      switch (result.event) {
        case 'ContractAdded':
          console.log('ContractAdded', result.args.PubKey);
          addContract(result.args.PubKey,result.blockNumber);
          break;
        case 'MemberAdded':
          console.log('MemberAdded', result.args._Address);
          memberquota[result.args._Address] = {
            totalsize: 0
          };
          break;
        case 'Banned':
        case 'BanAttempt':
          console.log('Event handler not implemented:',result.event);
          break;
        default:
          break;
      }
    } else {
      console.log(error, result);
    }
  });
});

function addContract(contractaddress,startblock){
  if (watchedcontracts[contractaddress]){
    console.log('already watching address',contractaddress);
    return;
  }
  var contract = web3.eth.contract(config.IPFSEventsAbi).at(contractaddress);
  
  var eventlistener = contract.allEvents({
    fromBlock: startblock,
    toBlock: 'latest'
  });

  var listener = eventlistener.watch(function(error, result) {
    if (error == null) {
      switch (result.event) {
        case 'HashAdded':
          web3.eth.getBlock(result.blockNumber, function(error, blockInfo) {
            console.log('block timestamp approx=', blockInfo.timestamp);

            var remainingTTL = parseInt(result.args.ttl) + blockInfo.timestamp * 1000;
            console.log('remaining TTL', remainingTTL);

            if (remainingTTL < 0) {
              console.log('already expired - not adding to pinned list');
            } else {
              // TODO : get size of file on this hash
              // TODO : totalsize of member
              // TODO : if totalsize + filesize > memberquota[member] -> ban user
              // TODO : else, increase totalsize 

              console.log('pinning hash', result.args.IPFSHash);

              ipfs.pin.add(result.args.IPFSHash, function(err, res) {
                console.log('pinned...', result.args.IPFSHash, err, res);
                addexpiration(result.args.IPFSHash, remainingTTL);
              });
            }
          });
          break;
        case 'HashRemoved':
          removehash(result.args.IPFSHash);
          break;
      }
    } else {
      console.log(error, result);
    }
  });

  watchedcontracts[contractaddress] = listener;

}


// clean the hashtaglist every hour.
setInterval(cleanepoch, 1000 * 60 * 60);

function addexpiration(ipfshash, expiretimestamp) {
  var epoch = timestamptoepoch(expiretimestamp);
  //  is this ipfshash unknown or is this the latest expiry of an existing ipfshash ?
  if (!hashvalidity[ipfshash] || hashvalidity[ipfshash] < expiretimestamp) {

    // remove old epoch if it exists
    var oldepoch = timestamptoepoch(hashvalidity[ipfshash]);
    if (epochtohash[oldepoch] && epochtohash[oldepoch][ipfshash]) {
      delete epochtohash[oldepoch][ipfshash];
    }

    // mark latest expiration date
    hashvalidity[ipfshash] = expiretimestamp;

    // and flag this hash in it's epoch, to make removal easier.
    if (!epochtohash[epoch]) {
      epochtohash[epoch] = {};
    }
    epochtohash[epoch][ipfshash] = true;
  }
}

function cleanepoch() {
  var now = Date.now();
  var currentEpoch = timestamptoepoch(now);
  console.log('current epoch is', currentEpoch);
  if (epochtohash[currentEpoch]) {
    for (var hash in epochtohash[currentEpoch]) {
      if (epochtohash[currentEpoch].hasOwnProperty(hash)) {
        console.log('in epoch:', hash);
        if (hashvalidity[hash] && hashvalidity[hash] < now) {
          removehash(hash);
        }
      }
    }
  }
}

function removehash(ipfshash) {
  if (!hashvalidity[hash]) return;
  console.log('removing', hash);
  var myEpoch = timestamptoepoch(hashvalidity[hash]);
  ipfs.pin.rm(ipfshash, function(err, res) {
    if (err && err.code === 0) {
      console.log('already unpinned');
    } else {
      console.log('unpinned...', res);
    }
  });
  if (epochtohash[myEpoch]){
    delete epochtohash[myEpoch][hash];
  }
  delete hashvalidity[hash];
}

function timestamptoepoch(timestamp) {
  return Math.floor(timestamp / (1000 * 60 * 60));
}