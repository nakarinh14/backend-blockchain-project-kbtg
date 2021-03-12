// Endpoints to convert retrieve money from K Plus platform
import KBankTransactionService from "../../services/transaction";
import { Router } from 'express'
import FabricService from "../../services/fabric";
import CertificateService from "../../services/pdf";
import AuthService from "../../services/auth";
const router = Router();

router.post('/deposit', async (req, res) => {
    try{
        // const withdrawResponse = await KBankTransactionService.Withdraw(req.body);
        await FabricService.Deposit(res.locals.uid, req.body.amount)
        res.send({"status": "success"});
    } catch (err) {
        res.status(400).send({error: err})
    }
});

router.post('/donate', async (req, res) => {
    try{
        const fullname = await AuthService.GetFullName(res.locals.uid);
        const donateStatus = await FabricService.Donate(
            res.locals.uid,
            req.body.recipient,
            req.body.amount,
            req.body.cause,
            req.body.tax_reduction,
            fullname
        )
        // If user don't want tax reduction, don't generate a certificate for it
        if(req.body.tax_reduction){
            await CertificateService.generateCertificate(donateStatus)
        }
        res.send({result: donateStatus})
    } catch (err){
        console.log(err)
        res.status(400).send({error: err})
    }
})

router.get('/balance', async (req, res) => {
    // Get the balance of the current user.
    try {
        const balance = await FabricService.GetBalanceDonor(res.locals.uid)
        console.log(`Getting balance of ${res.locals.uid} with amount of ${balance}`)
        res.send({balance})
    } catch (err) {
        console.log(err)
    }
});


export default router;
