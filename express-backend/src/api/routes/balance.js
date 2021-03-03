import express from "express";
import FabricService from "../../services/fabric";

const router = express.Router();

router.get('/balance', async (req, res) => {
    // Get the balance of the current user.
    try {
        const balance = await FabricService.GetBalance(res.locals.uid)
        res.send({"data": balance})
    } catch (err) {
        console.log(err)
    }
});

export default router;
