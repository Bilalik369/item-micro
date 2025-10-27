import express from "express"
import {createItem } from "../controllers/item.controller.js"
import {authMiddleware} from "../middleware/auth.middleware.js"

const router = express.Router()


router.post("/" , authMiddleware ,createItem)



export default router 