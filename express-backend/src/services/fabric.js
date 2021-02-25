
import {Gateway, Wallets} from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';
import path from 'path';

export default class FabricService {
    constructor() {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        this.ccp = ccp
        this.ca = new FabricCAServices(caURL);
    }

    async RegisterUser(uid) {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);

            // Check to see if we've already enrolled the user.
            const userIdentity = await wallet.get(uid);
            if (userIdentity) {
                console.log('An identity for the user "appUser" already exists in the wallet');
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
            const secret = await this.ca.register({
                affiliation: 'org1.department1',
                enrollmentID: uid,
                role: 'client'
            }, adminUser);
            const enrollment = await this.ca.enroll({
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
            await wallet.put('appUser', x509Identity);
            console.log(`Successfully registered and enrolled admin user ${uid} and imported it into the wallet`);
            return true;

        } catch (error) {
            console.error(`Failed to register user "appUser": ${error}`);
            return false
        }
    }

    async Donate(from, to, amount, cause) {
        try {
            // Submit the specified transaction.
            const { contract, gateway } = this._connectGateway(from)
            await contract.submitTransaction('Donate', from, to, amount, cause);
            console.log('Transaction has been submitted');
            // Disconnect from the gateway.
            await gateway.disconnect();
            return true
        } catch (err) {
            console.error(`Failed to submit transaction: ${err}`);
            return false
        }
    }

    async GetBalance() {
        try {
            // Evaluate a transacion query
            const { contract, gateway } = this._connectGateway(from)
            const result = await contract.evaluateTransaction('TotalSupply');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
            // Disconnect from the gateway.
            await gateway.disconnect();
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            return false
        }
    }

    async _connectGateway(user) {
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
        await gateway.connect(this.ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('ktw');
        return {contract, gateway}

    }

}

