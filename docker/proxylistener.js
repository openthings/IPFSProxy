var Web3 = require('web3');
var ipfsAPI = require('ipfs-api');
var config = require('./config.json');

var ipfs = ipfsAPI(config.ipfsapi);
var web3 = new Web3(new Web3.providers.HttpProvider(config.web3host));

var contract = web3.eth.contract(config.abi).at(config.contractaddress);

var events = contract.allEvents({
  fromBlock: config.startblock,
  toBlock: 'latest'
});

console.log("Currently at block=" + web3.eth.blockNumber);

var memberquota = {};
var hashvalidity = {};
var epochtohash = {};

contract.sizeLimit(function(err, res) {
  if (err) {
    process.exit();
  }
  var sizelimit = res.toNumber(10);
  console.log('sizelimit=', sizelimit);

  var listener = events.watch(function(error, result) {
    if (error == null) {
      switch (result.event) {
        case 'MemberAdded':
          console.log('MemberAdded', result.args._Address);
          memberquota[result.args._Address] = {
            totalsize: 0
          };
          break;
        case 'HashAdded':
          web3.eth.getBlock(result.blockNumber, function(error, blockInfo) {
            console.log('block timestamp approx=', blockInfo.timestamp);
            console.log('TTL=', result.args.ttl);

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
        default:
          console.log('Unknown event', result.event);
          break;
      }
    } else {
      console.log(error, result);
    }
  });
});

// clean the hashtaglist every hour.
setInterval(cleanepoch,1000 * 60 * 60);

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
  console.log('current epoch is',currentEpoch);
  if (epochtohash[currentEpoch]) {
    for (var hash in epochtohash[currentEpoch]) {
      if (epochtohash[currentEpoch].hasOwnProperty(hash)) {
          console.log('in epoch:',hash);
        if (hashvalidity[hash] && hashvalidity[hash] < now) {
          ipfs.pin.rm(hash, function(err, res) {
            if (err && err.code === 0) {
              console.log('already unpinned');
            } else {
              console.log('unpinned...', res);
            }
          });
          console.log('removing',hash);
          delete epochtohash[currentEpoch][hash];
          delete hashvalidity[hash];
          dumpdata();
        }
      }
    }
  }
}

function timestamptoepoch(timestamp) {
  return Math.floor(timestamp / (1000 * 60 * 60));
}