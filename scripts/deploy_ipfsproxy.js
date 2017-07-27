var IPFSProxy = artifacts.require("./IPFSProxy.sol");

module.exports = function(callback) {
  IPFSProxy.new({
    gas: 2990380,
    gasPrice: 2 * 1e9,
  }).then(function(instance) {
    console.log("IPFSProxy deployed at", instance.address);
  }).catch(function(e) {
    console.log(e);
    callback();
  });
};