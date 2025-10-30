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

export const getAllItems = async(req , res)=>{
    try {
        const {
      page = 1,
      limit = 10,
      category,
      city,
      minPrice,
      maxPrice,
      availability,
      search,
      sortBy = "createdAt",
      order = "desc",
    } = req.query

    const filter = {isActive : true}
    if(category) filter.category = category
    if (city) filter["location.city"] = new RegExp(city, "i")
     if (availability) filter.availability = availability


    if(minPrice || maxPrice){
        filter.pricePerDay = {}
        if (minPrice) filter.pricePerDay.$gte = Number(minPrice)
        if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice)
    }
    if (search) {
      filter.$text = { $search: search }
    }
    const sortOptions = {}
    sortOptions[sortBy] = order === "asc" ? 1 : -1

    const items = await Item.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Item.countDocuments(filter)
    return res.status(200).json({
        items, 
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        totalItems: count,
    })


    } catch (error) {
        console.error("Get all items error:", error)
        return res.status(500).json({msg: "Failed to fetch items"})
    }
}

export const getItemById = async(req , res)=>{
    try {
         const { itemId } = req.params

    const item = await Item.findById(itemId)

    if (!item) {
      return res.status(404).json({msg : "Item not found"})
    }
     await item.incrementViews()
     return res.status(200).json({item})
    } catch (error) {
        console.error("Get item error:", error)
        return res.status(500).json({msg : "Failed to fetch item"})
    }
}

export const getItemsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

 
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    
    const items = await Item.find({ ownerId })
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

   
    const count = await Item.countDocuments({ ownerId });

  
    res.status(200).json({
      items,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      totalItems: count,
    });
  } catch (error) {
    console.error("Get items by owner error:", error);
    return res.status(500).json({ msg: "Failed to fetch items" });
  }
};


export const updateItem = async (req, res) => {
  try {
    const { itemid } = req.params
    const updates = req.body

   
    const item = await Item.findById(itemid)
    if (!item) {
      return res.status(404).json({ msg: "Item not found" })
    }


    if (item.ownerId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ msg: "You are not authorized to update this item" })
    }

    Object.keys(updates).forEach((key) => {
      if (key !== "ownerId" && key !== "_id") {
        item[key] = updates[key]
      }
    })

    await item.save()

    return res.status(200).json({
      item,
      msg: "Item updated successfully",
    })
  } catch (error) {
    console.error("Update item error:", error)
    res.status(500).json({ msg: "Failed to update item" })
  }
}

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params

    const item = await Item.findById(itemId)
    if (!item) {
      return res.status(404).json({ msg: "Item not found" })
    }

    
    if (item.ownerId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ msg: "You are not authorized to delete this item" })
    }

   
    await Item.findByIdAndDelete(itemId)

    return res.status(200).json({
      msg: "Item deleted successfully",
      item: null,
    })
  } catch (error) {
    console.error("Delete item error:", error)
    res.status(500).json({ msg: "Failed to delete item" })
  }
}
