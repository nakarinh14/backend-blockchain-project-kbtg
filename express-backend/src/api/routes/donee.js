import express from "express";
import FabricService from "../../services/fabric";

const router = express.Router();

router.post('/redeem', async (req, res) => {
    // Redeem the balance of donee.
    try {
        const status = await FabricService.Redeem(res.locals.uid, req.body.amount, req.body.cause)
        res.send({"status": "success"})
    } catch (err) {
        console.log(err)
    }
});

export default router;
