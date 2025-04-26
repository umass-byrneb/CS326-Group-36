import express from 'express';
import { getAllListings, addStorageItem, updateStorageItem } from '../controllers/storageController.js';

const router = express.Router();

router.get('/listings',      getAllListings);
router.post('/listings',     addStorageItem);
router.post('/listings/:id', updateStorageItem);

export default router;