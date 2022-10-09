import express from "express";
import { registerValidation, loginValidation, errorMiddleware } from "../../middlewares/validation/index.js";
import userModel from "../../model/usermodel.js";
import randomString from "../../utils/randomString.js";
import generateToken from "../../middlewares/auth/generateToken.js";
import bcrypt from "bcrypt";


const router = express.Router();

router.post("/signUp", registerValidation(), errorMiddleware, async (req, res) => {
    try {
        let { email, phone } = req.body;
        const mailFound = await userModel.findOne({ user:email });
        if (mailFound) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const phoneFound = await userModel.findOne({ user:phone });
        if (phoneFound) {
            return res.status(409).json({ error: "Phone already registered" });
        }
        req.body.password = await bcrypt.hash(req.body.password, 12);
        let userData = new userModel(req.body);

        await userData.save();
        res.status(200).json({ success: "User Signed it Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/Login", loginValidation(), errorMiddleware, async (req, res) => {
    try {
        // userLogin = new userModel(req.body);
        let { email, password } = req.body;
        let userFound = await userModel.findOne({ user:email });
        if (!userFound) {
            return res.status(401).json({ error: "Invalid Credentials(User not Found" });
        }
        let matchPassword = await bcrypt.compare(req.body.password, userFound.password);
        if (!matchPassword) {
            return res.status(401).json({ error: "Invalid Credentials" })
        }
        let payload = {
            user_id: userFound._id,
            role: "user"
        }
        const token = generateToken(payload);
        res.status(200).json({ success: "Login is Successfull", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

export default router;