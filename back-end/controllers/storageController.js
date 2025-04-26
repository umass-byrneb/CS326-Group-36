import { getTaskModel } from "../models/modelFactory.js";

const StorageModel = getTaskModel("storage");


export async function getAllListings(_, res, next) {
    try {
        const listings = await StorageModel.getAll();
        return res.status(200).json({listings})
    } catch (err) {
        next(err)
    }
}

export async function addStorageItem(req, res, next) {
    try {
        const request = {...req.body}
        if (!request.title) {
            return res.status(400).json({error: "Title is missing"});
        }
        const newitem = await StorageModel.create(request);
        return res.status(200).json(newitem);
    } catch (err) {
        next(err);
    }
}

export async function updateStorageItem(req, res, next) {
    try {
        const itemID = req.body;
        const updateSucess = await StorageModel.updateById(itemID);
        if (!updateSucess) {
            return res.status(400).json({error: "Invalid ID. Failed to update the Storage Listing"});
        }
        return res.status(200).json({message: "Successfully updated the item with its ID."});
    } catch (err) {
        next(err);
    }
}