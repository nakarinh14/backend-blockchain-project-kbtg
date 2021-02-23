// Endpoints to convert retrieve money from K Plus platform
import { transactionValidator } from '../../validators/transaction';
import KBankTransactionService from "../../services/transaction";
import { isAuth } from "../middlewares/isAuth"
import { Router } from 'express'

const router = Router();

router.post('/withdraw', isAuth, transactionValidator, async (req, res) => {
    try{
        const withdrawResponse = await KBankTransactionService.Withdraw(req.body);
        res.send('respond with a resource');
    } catch (e) {
        res.status(400).send({error: e})
    }
});

module.exports = router;
