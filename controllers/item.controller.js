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