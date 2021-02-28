// Endpoints to convert retrieve money from K Plus platform
import KBankTransactionService from "../../services/transaction";
import { Router } from 'express'
import FabricService from "../../services/fabric";

const router = Router();

router.post('/deposit', async (req, res) => {
    try{
        const withdrawResponse = await KBankTransactionService.Withdraw(req.body);
        res.send({"status": "success"});
    } catch (err) {
        res.status(400).send({error: err})
    }
});

router.post('/donate', async (req, res) => {
    try{
        const donateStatus = FabricService.Donate(
            res.locals.uid, req.body.recipient, req.body.amount, req.body.causes
        )
        if(donateStatus){
            res.send({"status": "success"})
        }
    } catch (err){
        res.status(400).send({error: err})
    }
    res.send('respond with a resource');
})


export default router;
