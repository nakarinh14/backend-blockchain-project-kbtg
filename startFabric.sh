# Start node backend
npm start --prefix express-backend/

CC_SRC_LANGUAGE="javascript"
CC_SRC_PATH="../chaincode/"

# Clean out any old identites in the wallets
rm -rf javascript/wallet/*

# launch network
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn ktw -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
popd
