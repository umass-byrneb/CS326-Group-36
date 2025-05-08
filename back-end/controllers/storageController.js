//milestone 6
import { Storage } from "../models/index.js";


export async function getAllListings(_, res, next) {
    try {
        const listings = await Storage.findAll();
        return res.status(200).json({listings});
    } catch (err) {
        console.log("error received: ", err);
        next(err)
    }
}

export async function addStorageItem(req, res, next) {
    try {
        const {title, duration, cost, size, contact, description, image, owner, listed} = req.body
        if (!title || !duration || !image || !size) {
            return res.status(400).json({error: "All required fields weren't received."});
        }
        const newitem = await Storage.create({title, duration, cost, size, contact, description, image, owner, listed});
        return res.status(200).json(newitem);
    } catch (err) {
        console.log("Err in adding storage item: ", err);
        next(err);
    }
}

export async function updateStorageItem(req, res, next) {
    try {
        const itemID = parseInt(req.params.id);
        const { listed } = req.body;
        if (isNaN(itemID) || typeof listed !== 'boolean') {
            return res.status(400).json({ error: 'Invalid request.' });
        }
        const [count] = await Storage.update({ listed }, { where: { id:itemID } });
        if (!count) {
            return res.status(404).json({ error: 'Storage item not found.' });
        }
        const updated = await Storage.findByPk(itemID);
        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

export async function deleteStorageItemId(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({error: 'Invalid request.'});
        }
        const count = await Storage.destroy({ where: { id }});
        if (!count) {
            return res.status(400).json({error: 'Storage Item not found.'});
        }
        return res.status(200).end();
    } catch (error) {
        next(error);
    }
}