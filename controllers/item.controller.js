import Item from "../models/Item.model.js";


export const createItem = async(req ,res)=>{
    try {
        const itemData = {
            ...req.body,
            ownerId :req.user.userId
        }
        const item = new Item(itemData)
        await item.save();
         return res.status(201).json({msg : "Item created successfully"})
    } catch (error) {
        console.error("create item error " , error)
        return res.status(500).json({msg : "Failed to create item"})
    }
}