import {donationSchema} from "./donationSchema";
import {transactionSchema} from "./transactionSchema";
import {registerSchema} from "./registerSchema";
import {redeemSchema} from "./redeemSchema";

export default {
    '/auth/register': registerSchema,
    '/api/donor/deposit': transactionSchema,
    '/api/donor/donate': donationSchema,
    '/api/donee/redeem': redeemSchema,
};
