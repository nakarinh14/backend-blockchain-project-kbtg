import AuthService from '../../services/auth'

export const isAuthenticated = async (req, res, next) => {
    try {
        // Attach user profile res object to be process by next middlewares
        res.locals = await AuthService.VerifyToken(req.body.idToken)
        next()
    }
    catch (err){
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
