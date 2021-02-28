import express from "express";
import FabricService from "../../services/fabric";

const router = express.Router();

router.get('/', async (req, res) => {
    // Get the balance of donee.
    try {
        const balance = await FabricService.TransactionHistory(res.locals.uid)
        res.send({"data": balance})
    } catch (err) {
        console.log(err)
    }
});

export default router;
