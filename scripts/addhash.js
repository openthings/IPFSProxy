var IPFSProxy = artifacts.require("./IPFSProxy.sol");

module.exports = function(callback) {
  // IPFSProxy.deployed().then(function(instance) {
  //   instance.addHash('QmQkw8bH494fN1d5vJQQorvVrg86MZ1cUWEqpRcUECjxQR', 1000 * 5);
  // });
   IPFSProxy.at('0x9f54b4be2f29cbe994d965840c7384af1616d0b4').then(function(instance) {
    instance.addHash('QmQkw8bH494fN1d5vJQQorvVrg86MZ1cUWEqpRcUECjxQR', 1000 * 5);
  });  
};