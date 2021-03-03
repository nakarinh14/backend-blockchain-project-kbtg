import {donationSchema} from "./validators/donationSchema";
import {transactionSchema} from "./validators/transactionSchema";
import {registerSchema} from "./validators/registerSchema";
import {redeemSchema} from "./validators/redeemSchema";

export default {
    '/auth/register': registerSchema,
    '/api/donor/deposit': transactionSchema,
    '/api/donor/donate': donationSchema,
    '/api/donee/redeem': redeemSchema,
};
