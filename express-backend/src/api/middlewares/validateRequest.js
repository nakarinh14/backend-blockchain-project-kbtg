const createValidatorMiddleware = (validator) => async (req, res, next) => {
    try {
        await validator.validateAsync(req.body);
        next()
    } catch (e) {
        res.status(400).send({
            error: e
        })
    }
}

