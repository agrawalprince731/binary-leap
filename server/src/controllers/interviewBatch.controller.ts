import { Request, Response } from 'express';
import Admin from '../models/admin';
import Batch from '../models/batches';
import { adminId } from '../utils/fixed';

export const createBatch = async (req: Request, res: Response) => {
    try {
        // const adminId = req.user?.id;
        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const { name ,role} = req.body;
        const newBatch = new Batch({
            name,
            role,
            admin: admin._id
        });

        await newBatch.save();
        res.status(201).json(newBatch);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export const getAllBatches = async (req: Request, res: Response) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const batches = await Batch.find({ admin: admin._id });
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

