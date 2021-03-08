import admin from "firebase-admin";
import * as serviceAccount from "./firebase-admin-pk.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://edonation-blockchain-default-rtdb.firebaseio.com',
    storageBucket: 'edonation-blockchain.appspot.com'
});

export default admin
