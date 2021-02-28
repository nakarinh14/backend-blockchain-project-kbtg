/*
* Use this file for functional testing of your smart contract.
* Fill out the arguments and return values for a function and
* use the CodeLens links above the transaction blocks to
* invoke/submit transactions.
* All transactions defined in your smart contract are used here
* to generate tests, including those functions that would
* normally only be used on instantiate and upgrade operations.
* This basic test file can also be used as the basis for building
* further functional tests to run as part of a continuous
* integration pipeline, or for debugging locally deployed smart
* contracts by invoking/submitting individual transactions.
*/
/*
* Generating this test file will also trigger an npm install
* in the smart contract project directory. This installs any
* package dependencies, including fabric-network, which are
* required for this test file to be run locally.
*/

'use strict';

const assert = require('assert');
const fabricNetwork = require('fabric-network');
const SmartContractUtil = require('./js-smart-contract-util');
const os = require('os');
const path = require('path');

describe('TokenERC20Contract-fabric@0.0.3' , () => {

    const homedir = os.homedir();
    const walletPath = path.join(homedir, '.fabric-vscode', 'v2', 'environments', '1 Org Local Fabric', 'wallets', 'Org1');
    const gateway = new fabricNetwork.Gateway();
    let wallet;
    const identityName = 'Org1 Admin';
    let connectionProfile;

    before(async () => {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
        wallet = await fabricNetwork.Wallets.newFileSystemWallet(walletPath);
    });

    beforeEach(async () => {

        const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled = true;

        const options = {
            wallet: wallet,
            identity: identityName,
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled
            }
        };

        await gateway.connect(connectionProfile, options);
    });

    afterEach(async () => {
        gateway.disconnect();
    });

    describe('BalanceOfDonee', () =>{
        it('should submit BalanceOfDonee transaction', async () => {
            // TODO: populate transaction parameters

            await SmartContractUtil.submitTransaction('TokenERC20Contract', 'Mint', ["a", 100], gateway);
            await SmartContractUtil.submitTransaction('TokenERC20Contract', 'DonateFrom', ["a", "b", 50, "general"], gateway);
            await SmartContractUtil.submitTransaction('TokenERC20Contract', 'DonateFrom', ["a", "b", 20, "roof"], gateway);
            const args = [ "b"];
            const response = await SmartContractUtil.submitTransaction('TokenERC20Contract', 'BalanceOfDonee', args, gateway); // Returns buffer of transaction return value
            // TODO: Update with return value of transaction

            assert.deepStrictEqual(JSON.parse(response.toString()), {
                "total_balance": 70,
                "causes": {
                    "general": 50,
                    "roof": 20
                }
            });
        }).timeout(10000);
    });

    describe('Donate', () =>{
        it('should submit Donate transaction', async () => {
            // TODO: populate transaction parameters
            const arg0 = 'EXAMPLE';
            const arg1 = 'EXAMPLE';
            const arg2 = 'EXAMPLE';
            const args = [ arg0, arg1, arg2];

            const response = await SmartContractUtil.submitTransaction('TokenERC20Contract', 'Donate', args, gateway); // Returns buffer of transaction return value
            // TODO: Update with return value of transaction
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

});
