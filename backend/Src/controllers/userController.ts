import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, password, role } = req.body;
    if (!name || !phone || !password || !role) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: 'Phone already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, phone, password: hash, role });
    await user.save();
    const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ user: { id: user._id, name: user.name, phone: user.phone, role: user.role }, token });
  } catch (err: any) {
    console.error('Register error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ message: 'Missing phone or password' });

    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, phone: user.phone, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ user: { id: user._id, name: user.name, phone: user.phone, role: user.role }, token });
  } catch (err: any) {
    console.error('Login error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
