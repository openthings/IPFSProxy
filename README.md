# IPFSProxy

## Description

A smart contract that emits events from a list of consortium members to add and remove persistent IPFS hashes.
Consortium members agree to pin IPFS hashes in their respective IPFS instances

## Running the proxylistener

Run an IPFS node on your machine, then run these commands:

```
$ cd docker
$ npm install
$ node proxylistener.js

```

## Running in a docker container

```
$ cd docker 
$ docker build -t ipfs-proxy .
$ docker run ipfs-proxy
```

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





