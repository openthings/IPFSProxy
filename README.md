# IPFSProxy

## Description

A smart contract that emits events from a list of consortium members to add and remove persistent IPFS hashes.
Consortium members agree to pin IPFS hashes in their respective IPFS instances

## Install requirements

``` $ npm install ```

## Run the proxylistener ( on the livenet - via docker )

```
$ cd docker 
$ docker build -t ipfs-proxy .
$ docker run ipfs-proxy
```

## Run the tests

start testRPC

``` $ testrpc```

In a seperate window , run the unit tests

``` $ truffle test ```

## Useful links

### IPFS API

https://github.com/ipfs/interface-ipfs-core#api





