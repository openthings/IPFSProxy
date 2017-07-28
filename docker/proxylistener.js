var Web3 = require('web3');
var web3 = new Web3();
var ipfsAPI = require('ipfs-api');
var config = require('./config.json');

console.log('config:',config);

var ipfs = ipfsAPI(config.ipfsapi);
web3.setProvider(new web3.providers.HttpProvider(config.web3host));

var contract = web3.eth.contract(config.abi).at(config.contractaddress);


var startBlock = config.startblock ;
var events = contract.HashAdded({
    fromBlock: startBlock,
    toBlock: "latest"
});
console.log("block=" + web3.eth.blockNumber);

var listener = events.watch(function(error, result) {
  if (error == null && result.args) {
    console.log('pinning hash', result.args.IPFSHash);
    ipfs.pin.add(result.args.IPFSHash, function(err, res) {
      console.log('pinned...',result.args.IPFSHash, err, res);
    });
    setTimeout(function() {
      ipfs.pin.rm(result.args.IPFSHash, function(err, res) {
        if (err && err.code === 0){
          console.log('already unpinned');
        }else{
          console.log('unpinned...', res);
        }
      });
    }, result.args.ttl);
  } else {
    console.log(error);
  }
});
