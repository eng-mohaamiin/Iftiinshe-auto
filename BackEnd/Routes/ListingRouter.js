import { Router } from "express";
import { createListing, deleteListing,UpdateteListing,getListing, getListings } from "../controllers/listingController.js";
import { verifyToken } from "../utils/verifyToken.js";

let router = Router()


router.post("/", createListing)
router.delete("/delete/:id", verifyToken, deleteListing )
router.put("/update/:id", verifyToken, UpdateteListing )
router.get("/get/:id", getListing )
router.get("/get", getListings )










export default router