import admin from '../config/firebaseConfig'

export default class AuthService {

    static async VerifyToken(idToken){
        // idToken comes from the client app
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // Return corresponding user's uid and role
        return {
            uid: decodedToken.uid,
            role: decodedToken.role
        };
    }

    static async InitUser(uid, data){
        await this._registerProfile(uid, data)
        await this._addRole(uid, "donor")
    }

    static async GetFullName(uid){
        const snapshot = await admin.database().ref(`users/${uid}`).once('value');
        const userRecord = snapshot.val();
        return `${userRecord.firstname} ${userRecord.lastname}`
    }

    static async _registerProfile(uid, data){
        // Add user profile to the local profile
        const db = admin.database();
        const ref = db.ref(`users/${uid}`);
        const snapshot = await ref.once('value')
        if(snapshot.exists()){
            // If user already exist, throw an error
            throw new Error('User profile already exist');
        }
        await ref.set({
            firstname: this._titleCase(data.firstname),
            lastname: this._titleCase(data.lastname)
        })
    }

    static async _addRole(uid, role) {
        // If the existing user have no role, add the role to customClaims
        const userRecord = await admin.auth().getUser(uid)
        if(!userRecord.customClaims || !userRecord.customClaims['role']){
            await admin.auth().setCustomUserClaims(uid, {role})
        }
    }

    static _titleCase(string){
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }
}
