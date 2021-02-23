// Endpoints to convert retrieve money from K Plus platform
import { transactionValidator } from '../../validators/transaction';
import { Router } from 'express'

const router = Router();

router.post('/withdraw', transactionValidator, (req, res) => {
    res.send('respond with a resource');
});

module.exports = router;
