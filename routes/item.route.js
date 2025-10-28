import express from "express"
import {createItem, getAllItems } from "../controllers/item.controller.js"
import {authMiddleware} from "../middleware/auth.middleware.js"

const router = express.Router()


router.post("/" , authMiddleware ,createItem)
router.get("/" , authMiddleware ,getAllItems)



export default router 