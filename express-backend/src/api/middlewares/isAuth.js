import admin from '../../config/firebaseConfig'

export const isAuth = async (req, res, next) => {
    try {
        // idToken comes from the client app
        // const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);
        // Attach to res object to be process by next middlewares
        // res.locals.uid = decodedToken.uid;
        next()
    }
    catch (e){
        res.status(401).send({
            error: e
        })
    }
}

