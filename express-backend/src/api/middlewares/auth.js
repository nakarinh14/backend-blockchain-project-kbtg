import AuthService from '../../services/auth'

export const isAuthenticated = async (req, res, next) => {

    try {
        // Attach user profile res object to be process by next middlewares
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).send()
        }
        const access_token = authHeader.split(' ')[1];
        res.locals = await AuthService.VerifyToken(access_token)
        next()
    }
    catch (err){
        console.log(err)
        return res.status(401).send({
            error: err
        })
    }
}

export const isAuthorized = (roles) => async (req, res, next) => {
    try {
        if(roles.hasRole.includes(res.locals.role)){
            return next()
        }
    }
    catch (err){
        return res.status(401).send({
            status: "failed",
            message: err
        })
    }
}
