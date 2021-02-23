import _ from 'lodash'
import Schemas from "./validators/schemas"

export default () => {
    // enabled HTTP methods for request data validation
    const _supportedMethods = ['post'];

    // return the validation middleware
    return async (req, res, next) => {
        const route = req.baseUrl + req.path;
        const method = req.method.toLowerCase();
        try {
            if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
                // get schema for the current route
                const _schema = _.get(Schemas, route);
                if (_schema) {
                    // Validate req.body using the schema and validation options
                    await _schema.validateAsync(req.body)
                    return next();
                }
            }
            next();
        } catch (err){
            // Send back the JSON error response
            res.status(422).json({
                status: 'failed',
                error: {
                    original: err,
                    // fetch only message and type from each error
                    // details: _.map(err.details, ({message, type}) => ({
                    //     message: message.replace(/['"]/g, ''),
                    //     type
                    // }))
                }
            });
        }
    };
};
