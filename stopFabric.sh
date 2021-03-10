./fabric-samples/test-network/network.sh down
rm -rf fabric-samples
docker container kill $(docker ps -q)
