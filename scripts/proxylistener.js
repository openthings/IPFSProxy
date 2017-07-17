var IPFSProxy = artifacts.require("./IPFSProxy.sol");
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');



module.exports = function(callback) {

  IPFSProxy.deployed().then(function(instance) {

    var events = instance.HashAdded({
      fromBlock: "latest"
    });
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


  });

};