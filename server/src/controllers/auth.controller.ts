import { Request, Response } from 'express';
import Admin from '../models/admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const admin = new Admin({ email, password, name });
        await admin.save();
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true });
        res.status(201).json({ message: 'Admin created successfully', accessToken: token });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', accessToken: token });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else {
            token = req.cookies.authToken;
        }

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const adminId = decoded.id;
        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(admin);
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
};



