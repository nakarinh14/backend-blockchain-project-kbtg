import express from 'express';
import FabricService from "../../services/fabric";
import AuthService from "../../services/auth";

const router = express.Router();

router.get('/register', async (req, res) => {
    try {
        // User account have be to registered first
        const { uid } = res.locals.uid
        // Initialize user profile of the authenticated user
        await AuthService.InitUser(uid, req.body);
        // Register the authenticated uid user to blockchain network
        await FabricService.InitUser(uid)
        res.send({"status": "success"})
    } catch (err) {
        console.log(err)
        res.status(400).send({"status": "failed", "message": err})
    }
});

export default router;
