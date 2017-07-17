var IPFSProxy = artifacts.require("./IPFSProxy.sol");

var testHash = 'QmTXUwTJtrUPAT3DppvHd5dvzRNzJPqwWQg6iWxvHhMuxX';
var testTTL = 100;

contract('IPFSProxy', function(accounts) {
  it("owner should be able to add a hash", function(done) {
    IPFSProxy.deployed().then(function(instance) {

      var events = instance.HashAdded({
        fromBlock: "latest"
      });
      var listener = events.watch(function(error, result) {
        listener.stopWatching();
        if (error == null && result.args) {
          assert.equal(result.args.PubKey, accounts[0]);
          assert.equal(result.args.IPFSHash, testHash);
          assert.equal(result.args.ttl, testTTL);
          done();
        }else{
          asset.fail(error);
          done();
        }
      });

      // test if owner can add a hash
      instance.addHash(testHash, testTTL, {
        from: accounts[0]
      });
    }).then(function() {
    });
  });

  it("a non-member account (accounts[1]) should NOT be able to add a hash", function(done) {
    IPFSProxy.deployed().then(function(instance) {
      instance.addHash(testHash, testTTL, {
        from: accounts[1]
      }).then(function(res) {
        assert.fail(null, null, 'this function should throw', e);
        done();
      }).catch(function(e) {
        done();
      });
    });
  });

  it("owner should be able to add a member (accounts[1])", function(done) {
    IPFSProxy.deployed().then(function(instance) {
      instance.addMember(accounts[1], {
        from: accounts[0]
      }).then(function(res) {
        assert.fail(null, null, 'this function should throw');
        done();
      }).catch(function(e) {
        done();
      });
    });
  });


  it("a member account (accounts[1]) should now be able to add a hash", function(done) {
    IPFSProxy.deployed().then(function(instance) {
      instance.addHash(testHash, testTTL, {
        from: accounts[1]
      }).then(function(res) {
        done();
      }).catch(function(e) {
        assert.fail(null, null, 'this function should not throw', e);
        done();
      });
    });
  });

});