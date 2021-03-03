import AuthService from '../../services/auth'

const mockData = true;

export const isAuthenticated = async (req, res, next) => {
    try {
        // Attach user profile res object to be process by next middlewares
        if(mockData){
            // Assuming logged in user is a
            res.locals = req.body.idToken
            return next()
        }
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
        if(mockData){
            return next()
        }
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
