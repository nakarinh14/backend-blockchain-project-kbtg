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

    static async Deposit(uid, amount){
        // Submit the specified transaction.
        await this.executeTransaction(uid, false, 'MintFrom', [uid, amount])
        console.log(`Mint has been submitted for ${uid} with amount ${amount}`);
        return true
    }

    static async Donate(uid_from, uid_to, amount, cause, tax_reduction, fullname) {

        // Submit the specified transaction.
        console.log(`${uid_from} donating to ${uid_to} for ${amount} to ${cause} cause`)
        // Parse value amount in 2 decimal float for visual consistency
        const res = await this.executeTransaction(
            uid_from, false, 'DonateFrom', [uid_from, uid_to, parseFloat(amount).toFixed(2), cause, tax_reduction, fullname]
        );
        console.log('Donation has been submitted');
        return JSON.parse(res.toString())

    }

    static async GetBalanceDonor(uid){
        const res = await this.executeTransaction(uid, true, 'BalanceOfDonator', [uid])
        return res.toString()
    }

    static async GetBalanceDonee(org){
        const res = await this.executeTransaction('admin', true, 'BalanceOfDonee', [org])
        return JSON.parse(res.toString())
    }
    static async Redeem(org, amount, cause) {
        // Submit the specified transaction.
        const res = await this.executeTransaction(
            'admin', false, 'BurnFrom', [org, amount, cause]
        )
        console.log(`Redeem is successful on ${uid}`);
        // Disconnect from the gateway.
        return true
    }

    static async GetAllTransactionHistory(){
        // Evaluate a transaction query
        const res = await this.executeTransaction('admin', true, 'AllTransactionHistory', [])
        return JSON.parse(res.toString())
    }

    static async GetTransactionHistory(uid){
        // Evaluate a transaction query
        const result = await this.executeTransaction(
            'admin', true, 'UserTransactionHistory', [uid]
        )
        return JSON.parse(result.toString())
    }

    static async InitUser(uid){
        await this.RegisterUser(uid);
        // Setup a balance of 0 for user, for future use
        await this.Deposit(uid, 0);
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

            console.log(`Successfully registered and enrolled client user ${uid} and imported it into the wallet`);

        } catch (error) {
            console.error(`Failed to register user "${uid}": ${error}`);
            return false
        }
    }

    static async executeTransaction(user, evaluateOnly, funcName, args) {
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

        let res;
        if(!evaluateOnly){
            res = await contract.submitTransaction(funcName, ...args);
        } else {
            res = await contract.evaluateTransaction(funcName, ...args);
        }
        await gateway.disconnect();

        return res;
    }

}

