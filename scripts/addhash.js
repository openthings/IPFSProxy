var IPFSProxy = artifacts.require("./IPFSProxy.sol");

module.exports = function(callback) {
  // IPFSProxy.deployed().then(function(instance) {
  //   instance.addHash('QmQkw8bH494fN1d5vJQQorvVrg86MZ1cUWEqpRcUECjxQR', 1000 * 5);
  // });
   IPFSProxy.at('0x7433c7c768be4025ab791fb7b2942c3d9e309f3e').then(function(instance) {
    instance.addHash('QmQkw8bH494fN1d5vJQQorvVrg86MZ1cUWEqpRcUECjxQR', 1000 * 60 * 60 * 24 * 365,{
   	 gas: 290380,
   	 gasPrice: 2 * 1e9,
  	});
  });  
};