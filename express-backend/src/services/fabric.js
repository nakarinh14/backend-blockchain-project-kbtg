import {Gateway, Wallets} from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';
import path from 'path';

// load the network configuration
const ccpPath = path.resolve(__dirname, '..', '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
// Create a new CA client for interacting with the CA.
const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
const caURL = caInfo.url;
const caTLSCACerts = caInfo.tlsCACerts.pem
const ca = new FabricCAServices(caURL);

export default class FabricService {

    static async InitUser(uid){
        await this.RegisterUser(uid);
        await this.Deposit(uid, 40000);
    }

    static async RegisterAdmin(){
        try {
            // load the network configuration
            const _ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the admin user.
            const identity = await wallet.get('admin');
            if (identity) {
                console.log('An identity for the admin user "admin" already exists in the wallet');
                return;
            }

            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await _ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await wallet.put('admin', x509Identity);
            console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

        } catch (error) {
            console.error(`Failed to enroll admin user "admin": ${error}`);
        }
    }

    static async RegisterUser(uid) {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get(uid);
            if (userIdentity) {
                console.log(`An identity for the user "${uid}" already exists in the wallet`);
                return;
            }
            // Check to see if we've already enrolled the admin user.
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                console.log('An identity for the admin user "admin" does not exist in the wallet');
                console.log('Run the enrollAdmin.js application before retrying');
                return;
            }
            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, 'admin');

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({
                affiliation: 'org1.department1',
                enrollmentID: uid,
                role: 'client'
            }, adminUser);
            const enrollment = await ca.enroll({
                enrollmentID: uid,
                enrollmentSecret: secret
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            await wallet.put(uid, x509Identity);

            console.log(`Successfully registered and enrolled admin user ${uid} and imported it into the wallet`);

        } catch (error) {
            console.error(`Failed to register user "${uid}": ${error}`);
            return false
        }
    }

    static async Deposit(uid, amount){
        try {
            // Submit the specified transaction.
            const { contract, gateway } = this._connectGateway(uid)
            await contract.submitTransaction('MintFrom', uid, amount);
            console.log('Mint has been submitted');
            // Disconnect from the gateway.
            await gateway.disconnect();
            return true
        } catch (err) {
            console.error(`Failed to submit transaction: ${err}`);
            return false
        }
    }

    static async Donate(uid_from, uid_to, amount, cause) {
        try {
            // Submit the specified transaction.
            const { contract, gateway } = this._connectGateway(uid_from)
            await contract.submitTransaction('DonateFrom', uid_from, uid_to, amount, cause);
            console.log('Transaction has been submitted');
            // Disconnect from the gateway.
            await gateway.disconnect();
            return true
        } catch (err) {
            console.error(`Failed to submit transaction: ${err}`);
            return false
        }
    }

    static async GetBalanceDonee(uid){
        try {
            // Evaluate a transaction query
            const { contract, gateway } = this._connectGateway(uid)
            const result = await contract.evaluateTransaction('BalanceOfDonee', uid);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            // Disconnect from the gateway.
            await gateway.disconnect();
            return JSON.parse(result.toString())
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            return false
        }
    }

    static async GetBalanceDonor(uid){
        try {
            // Evaluate a transaction query
            const { contract, gateway } = this._connectGateway(uid)
            const result = await contract.evaluateTransaction('BalanceOfDonator', uid);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            // Disconnect from the gateway.
            await gateway.disconnect();
            return result
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            return false
        }
    }

    static async GetBalance(uid) {
        try {
            // Evaluate a transaction query
            const { contract, gateway } = this._connectGateway(uid)
            const result = await contract.evaluateTransaction('GetBalance');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            // Disconnect from the gateway.
            await gateway.disconnect();
            return result
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            return false
        }
    }

    static async Redeem(uid, amount, cause) {
        try {
            // Submit the specified transaction.
            const { contract, gateway } = this._connectGateway(uid)
            await contract.submitTransaction('BurnFrom', uid, amount, cause);
            console.log('Transaction has been submitted');
            // Disconnect from the gateway.
            await gateway.disconnect();
            return true
        } catch (err) {
            console.error(`Failed to submit transaction: ${err}`);
            return false
        }
    }

    static async GetAllTransactionHistory(){
        try {
            // Evaluate a transaction query
            const { contract, gateway } = this._connectGateway('admin')
            const result = await contract.evaluateTransaction('AllTransactionHistory');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            // Disconnect from the gateway.
            await gateway.disconnect();
            return JSON.parse(result.toString())
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            return false
        }
    }

    static async GetTransactionHistory(uid){
        try {
            // Evaluate a transaction query
            const { contract, gateway } = this._connectGateway('admin')
            const result = await contract.evaluateTransaction('UserTransactionHistory', uid);
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            // Disconnect from the gateway.
            await gateway.disconnect();
            return JSON.parse(result.toString())
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            return false
        }
    }

    static async AssignDonee(uid){
        try {
            // Submit the specified transaction.
            const { contract, gateway } = this._connectGateway(uid)
            await contract.submitTransaction('AssignDonee', uid);
            // Disconnect from the gateway.
            await gateway.disconnect();
            return true
        } catch (err) {
            console.error(`Failed to submit transaction: ${err}`);
            return false
        }
    }

    static async _connectGateway(user) {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(user);
        if (!identity) {
            throw new Error(`An identity for the user ${user} does not exist in the wallet`)
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp,
            {
                wallet,
                identity: user,
                discovery: { enabled: true, asLocalhost: true }
            });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('ktw-coin');
        return {contract, gateway}

    }

}

