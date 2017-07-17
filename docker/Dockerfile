FROM node:8

RUN wget https://dist.ipfs.io/go-ipfs/v0.4.4/go-ipfs_v0.4.4_linux-amd64.tar.gz
RUN tar xvfz go-ipfs_v0.4.4_linux-amd64.tar.gz
RUN mv go-ipfs/ipfs /usr/local/bin/ipfs

RUN npm install web3
RUN npm install ipfs-api

WORKDIR /
COPY startup startup
COPY proxylistener.js proxylistener.js

EXPOSE 5001
EXPOSE 8080
EXPOSE 4001

ENTRYPOINT /startup
