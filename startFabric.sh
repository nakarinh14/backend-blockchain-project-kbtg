# Fetch fabric samples and binary
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.3.0 1.4.9
export PATH=${PWD}/fabric-samples/bin:$PATH

CC_SRC_LANGUAGE="javascript"
CC_SRC_PATH="../../chaincode/"

# Clean out any old identites in the wallets
rm -rf javascript/wallet/*
rm -rf express-backend/wallet/*
# launch network
pushd ./fabric-samples/test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn ktw-coin -ccv 1 -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
popd

# Start node backend
npm start --prefix express-backend/
