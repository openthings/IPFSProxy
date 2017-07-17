var IPFSProxy = artifacts.require("./IPFSProxy.sol");

module.exports = function(callback) {
  IPFSProxy.deployed().then(function(instance) {
    instance.addHash('QmTXUwTJtrUPAT3DppvHd5dvzRNzJPqwWQg6iWxvHhMuxX', 1000 * 5);
  });
};