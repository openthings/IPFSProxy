# IPFSProxy

## Description

A smart contract that emits events from a list of consortium members to add and remove persistent IPFS hashes.
Consortium members agree to pin IPFS hashes in their respective IPFS instances

## As a consortium member or supporting node

### Running the proxylistener

Run an IPFS node on your machine, then run these commands:

```
$ cd docker
$ npm install
$ node proxylistener.js

```

### Running in a docker container

```
$ cd docker 
$ docker build -t ipfs-proxy .
$ docker run ipfs-proxy
```

## As a user of the IPFS consortium 

### Use it in your contract

Register your contract address in the IPFSProxy contract using the ```addContract``` function.

Inherit the IPFSEvents contract in your own

```
contract MyContract is IPFSEvents {
	...
	function myFunctionThatAddsAHash(){
		// add a hash to the IPFS consortium
		HashAdded(this,_IPFSHash,_ttl);
	}

	function myFunctionThatRemovesAHash(){
		HashRemoved(this,_IPFSHash);
	}
}
```

### Use it from any script using a regular ethereum account

call the function ```addHash``` and ```removeHash``` from the IPFSproxy contract directly

Ofcourse both functions only work when you / your contract is a member of the consortium.


## Useful scripts

Deploy the contract via truffle

``` $truffle exec ./scripts/deploy_ipfsproxy.js ```

Add a hash to the contract ( fill in the contractaddress and IPFS hash first )

``` $truffle exec ./scripts/addhash.js ```


## Run the tests

start testRPC

``` $ testrpc```

In a seperate window , run the unit tests

``` $ truffle test ```

## Useful links

### IPFS API

https://github.com/ipfs/interface-ipfs-core#api







