#!/bin/bash
pushd ./fabric-samples/test-network
./network.sh down
popd
rm -rf fabric-samples
docker container kill $(docker ps -q)
