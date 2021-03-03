import express from "express";
import FabricService from "../../services/fabric";

const router = express.Router();

router.get('/all', async (req, res) => {
    // Get all transaction history
    try {
        const balance = await FabricService.GetAllTransactionHistory()
        res.send({"data": balance})
    } catch (err) {
        console.log(err)
        res.status(400).send({error: err})
    }
});

router.get('/:id', async (req, res) => {
    // Get all transaction history
    try {
        const balance = await FabricService.GetTransactionHistory(req.params.id)
        res.send({"data": balance})
    } catch (err) {
        console.log(err)
        res.status(400).send({error: err})
    }
})

export default router;
