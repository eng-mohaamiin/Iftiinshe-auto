import { Router } from "express";
import { deleteUser, test, updateUser,getUserListing, getUser } from "../controllers/userContrllers.js";
import { verifyToken } from "../utils/verifyToken.js";

let router = Router()

router.get("/", test)
router.put("/update/:id", verifyToken, updateUser)
router.delete("/delete/:id", verifyToken, deleteUser)
router.get("/listings/:id", verifyToken, getUserListing )
router.get("/:id", verifyToken, getUser)


export default router