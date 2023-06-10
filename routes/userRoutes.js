import express from "express";
import { userLogin, userRegistration, userUpdate } from "../controllers/userController.js";
import { checkLogin, checkRegistration, checkUpdate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/registerUser", checkRegistration, userRegistration);
router.post("/loginUser", checkLogin, userLogin);
router.post("/updateUser", checkUpdate, userUpdate);

export default router;