#!/bin/bash
`aws ecr get-login --no-include-email --region us-east-1`

docker build -t ipfs-proxy .
docker tag ipfs-proxy:latest 599399774093.dkr.ecr.us-east-1.amazonaws.com/ipfs-proxy:latest
docker push 599399774093.dkr.ecr.us-east-1.amazonaws.com/ipfs-proxy:latest