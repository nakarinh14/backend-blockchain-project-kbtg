import express from "express";
import FabricService from "../../services/fabric";

const router = express.Router();


router.get('/balance', async (req, res) => {
    // Get the balance of donee.
    try {
        const balance = await FabricService.GetBalance(res.locals.uid)
        res.send({"data": balance})
    } catch (err) {
        console.log(err)
    }
});

router.post('/redeem', async (req, res) => {
    // Redeem the balance of donee.
    try {
        const status = await FabricService.Redeem(res.locals.uid, req.body.amount)
        res.send({"status": "success"})
    } catch (err) {
        console.log(err)
    }
});

export default router;
