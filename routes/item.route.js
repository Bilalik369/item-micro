import express from "express"
import {createItem} from "../controllers/item.controller.js"

const router = express.Router()


router.post("/" , createItem)



export default router 