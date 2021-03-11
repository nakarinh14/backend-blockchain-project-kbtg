import express from "express";
import FabricService from "../../services/fabric";

const router = express.Router();

router.get('/', async (req, res) => {
    // Get the balance of the current user.
    try {
        const balance = await FabricService.GetBalanceDonor(res.locals.uid)
        console.log(`Getting balance of ${res.locals.uid} with amount of ${balance}`)
        res.send({balance})
    } catch (err) {
        console.log(err)
    }
});

export default router;
