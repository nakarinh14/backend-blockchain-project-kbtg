// Endpoints to convert retrieve money from K Plus platform
import KBankTransactionService from "../../services/transaction";
import { Router } from 'express'
import FabricService from "../../services/fabric";
import CertificateService from "../../services/pdf";
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
        const donateStatus = await FabricService.Donate(
            res.locals.uid,
            req.body.recipient,
            req.body.amount,
            req.body.cause,
            req.body.tax_reduction
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


export default router;
