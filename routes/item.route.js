import express from "express"
import {createItem, getAllItems ,getItemById,getItemsByOwner, updateItem} from "../controllers/item.controller.js"
import {authMiddleware} from "../middleware/auth.middleware.js"

const router = express.Router()


router.post("/" , authMiddleware ,createItem)
router.get("/" , authMiddleware ,getAllItems)
router.get("/:itemId" , authMiddleware ,getItemById)
router.get("/owner/:ownerId", authMiddleware ,getItemsByOwner)
router.put("/:itemId", authMiddleware ,updateItem)




export default router 