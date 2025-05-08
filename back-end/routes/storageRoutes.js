//milestone 6

import express from 'express';
import { getAllListings, addStorageItem, updateStorageItem, deleteStorageItemId } from '../controllers/storageController.js';

const router = express.Router();

router.get('/listings',      getAllListings);
router.post('/listings',     addStorageItem);
router.put('/listings/:id', updateStorageItem);
router.delete('/listings/:id', deleteStorageItemId);

export default router;