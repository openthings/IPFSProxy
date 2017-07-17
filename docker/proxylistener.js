var Web3 = require('web3');
var web3 = new Web3();
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');

const web3Hostname = 'http://52.3.232.241:8545/';  // ropsten
web3.setProvider(new web3.providers.HttpProvider(web3Hostname));

var contractAddress = "0x2828b7E4Deb65Bcbf7C7534F382D2ef4d0B76aDe";
var contractAbi = [{"constant":false,"inputs":[{"name":"_Address","type":"address"}],"name":"removeMember","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"membership","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_Address","type":"address"}],"name":"isMember","outputs":[{"name":"_isMember","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_IPFHash","type":"string"},{"name":"_ttl","type":"uint256"}],"name":"addHash","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_Address","type":"address"}],"name":"addMember","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_IPFHash","type":"string"}],"name":"removeHash","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"PubKey","type":"address"},{"indexed":false,"name":"IPFSHash","type":"string"},{"indexed":false,"name":"ttl","type":"uint256"}],"name":"HashAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"PubKey","type":"address"},{"indexed":false,"name":"IPFSHash","type":"string"}],"name":"HashRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_Address","type":"address"}],"name":"MemberAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_Address","type":"address"}],"name":"MemberRemoved","type":"event"}];
var contract = web3.eth.contract(contractAbi).at(contractAddress);

var startBlock = 1312035;
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
