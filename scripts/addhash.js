var IPFSProxy = artifacts.require("./IPFSProxy.sol");

module.exports = function(callback) {
  // IPFSProxy.deployed().then(function(instance) {
  //   instance.addHash('QmQkw8bH494fN1d5vJQQorvVrg86MZ1cUWEqpRcUECjxQR', 1000 * 5);
  // });
   IPFSProxy.at('0xa0456ca26d68c2e422edd1bd45cdf5ecfc477e44').then(function(instance) {
    instance.addHash('QmQkw8bH494fN1d5vJQQorvVrg86MZ1cUWEqpRcUECjxQR', 1000 * 60 * 60 * 24 * 365,{
   	 gas: 290380,
   	 gasPrice: 2 * 1e9,
  	});
  });  
};