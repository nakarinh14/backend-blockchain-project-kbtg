import {donationSchema} from "./donationSchema";
import {transactionSchema} from "./transactionSchema";

export default {
    '/api/transaction/withdraw': donationSchema,
    '/api/transaction/donate': transactionSchema
};
