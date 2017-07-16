var IPFSProxy = artifacts.require("./IPFSProxy.sol");

module.exports = function(deployer) {
  deployer.deploy(IPFSProxy);
};
