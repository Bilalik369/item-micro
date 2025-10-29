import express from "express"
import {createItem, getAllItems ,getItemById} from "../controllers/item.controller.js"
import {authMiddleware} from "../middleware/auth.middleware.js"

const router = express.Router()


router.post("/" , authMiddleware ,createItem)
router.get("/" , authMiddleware ,getAllItems)
router.get("/:itemId" , authMiddleware ,getItemById)



export default router 