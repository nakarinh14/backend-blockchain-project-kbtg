import express from "express";
import FabricService from "../../services/fabric";

const router = express.Router();

router.post('/redeem/:org', async (req, res) => {
    // Redeem the balance of donee.
    try {
        const status = await FabricService.Redeem(req.params.org, req.body.amount, req.body.cause)
        res.send({"status": "success"})
    } catch (err) {
        console.log(err)
    }
});

router.get('/balance/:org', async (req, res) => {
    // Get the balance of the current user.
    try {
        const balance = await FabricService.GetBalanceDonee(req.params.org)
        console.log(`Getting balance of ${res.locals.uid} with amount of ${balance}`)
        res.send({balance})
    } catch (err) {
        console.log(err)
    }
});

export default router;
