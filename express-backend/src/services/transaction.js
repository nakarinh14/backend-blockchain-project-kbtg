import got from 'got'
import {getDateIsoTzOffset} from "../utils/isodatetime";

export default class KBankTransactionService {

    static async RetrieveToken() {
        try {
            const credential = `${process.env.KBANK_SANDBOX_KEY}:${process.env.KBANK_SANDBOX_SECRET}`;
            const encodedCredential = Buffer.from(credential).toString('base64');
            const response = await got.post('https://openapi-sandbox.kasikornbank.com/oauth/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': encodedCredential
                },
                body: {
                    'grant_type': 'client_credentials'
                }
            })

            return response.body['access_token']
        } catch (err) {
            console.log(err)
            return true
        }
    }

    static async AuthGuardedRequest(url, requestConfig) {
        try {
            const token = this.RetrieveToken()
            const bearer = `Bearer ${token}`
            const headers = {
                'Authorization': bearer
            }

            return await got.post(url, {
                ...requestConfig, headers
            })
        } catch (err) {
            console.log(err)
            return true
        }
    }

    static async Validate(transaction) {
        try {
            const url = 'https://openapi-sandbox.kasikornbank.com/v1/inward/confirm'
            const timestamp = getDateIsoTzOffset();
            const body = {
                "rqUid": "198343831086750",
                "rqDt": timestamp,
                "transferInfo": {
                    "orderingRefNo": "SDREF001",
                    "institutionId": "123",
                    "debitAcctId": "0381679322",
                    "orderingCustName": "John Smith",
                    "orderingCustNationality": "SGP",
                    "receivingCustName": "Kasikorn Rakthai",
                    "receivingBankCode": "022",
                    "receivingCntyCode": "THA",
                    "txnAmount": transaction.amount,
                    "txnCurrencyCode": transaction.currency,
                    "receivingAcctType": "004",
                    "receivingAcctId": "8000253321"
                }
            }

            return await this.AuthGuardedRequest(url, body)
        } catch (err) {
            console.log(err)
            return true
        }
    }

    static async Withdraw(transaction) {
        try {
            const url = 'https://openapi-sandbox.kasikornbank.com/v1/inward/confirm'
            const timestamp = getDateIsoTzOffset();
            const body = {
                "rqUid": "1553831086752",
                "rqDt": timestamp,
                "transferInfo": {
                    "orderingRefNo": "SDREF007",
                    "institutionId": "123",
                    "debitAcctId": "0331109045",
                    "orderingCustName": "John Smith",
                    "orderingCustNationality": "SG",
                    "orderingCustIdType": "1",
                    "orderingCustId": "SG12345678",
                    "orderingAddress": "House 12, 53 Main Street, Singapore 059492",
                    "orderingCntyOfResidence": "SG",
                    "receivingCustName": "Kasikorn Rakthai",
                    "receivingBankCode": "004",
                    "receivingCntyCode": "TH",
                    "txnAmount": transaction.amount,
                    "txnCurrencyCode": transaction.currencyType,
                    "receivingAcctType": "004",
                    "receivingAcctId": "0033991118",
                    "receivingEmail": "john.smith@gmail.com",
                    "txnDt": timestamp,  // Customer Transaction date and time (ISO 8601 format)
                    "purposeCode": "318040",
                    "schedule": "01",
                    "otherInfo": null,
                    "orderingCntySourceOfFund": "SG",
                }
            }
            return await this.AuthGuardedRequest(url, body)
        } catch (err) {
            return true
        }
    }

}
