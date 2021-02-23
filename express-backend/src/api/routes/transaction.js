// Endpoints to convert retrieve money from K Plus platform
import KBankTransactionService from "../../services/transaction";
import { Router } from 'express'

const router = Router();

router.post('/withdraw', async (req, res) => {
    try{
        const withdrawResponse = await KBankTransactionService.Withdraw(req.body);
        res.send('respond with a resource');
    } catch (err) {
        res.status(400).send({error: err})
    }
});

router.post('/donate', (req, res) => {
    res.send('respond with a resource');
})

export default router;
