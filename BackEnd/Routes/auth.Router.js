import { Router } from "express";
import { signIn, signUp, google, signOut } from "../controllers/authControler.js";

let router = Router()


router.post("/signUp", signUp)
router.post("/signIn", signIn)
router.post("/google", google)
router.get("/signout", signOut)




export default router