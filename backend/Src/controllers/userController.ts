import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password, role } = req.body;
    if (!name || !password || !role || (!phone && !email)) return res.status(400).json({ message: 'Missing fields' });

    // Check existing by phone or email
    const existing = await User.findOne({ $or: [{ phone }, { email }] });
    if (existing) return res.status(409).json({ message: 'Phone or email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, phone, email, password: hash, role });
    await user.save();
    const token = jwt.sign({ id: user._id, phone: user.phone, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ user: { id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role }, token });
  } catch (err: any) {
    console.error('Register error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // identifier can be phone or email
    if (!identifier || !password) return res.status(400).json({ message: 'Missing identifier or password' });

    const user = await User.findOne({ $or: [{ phone: identifier }, { email: identifier }] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, phone: user.phone, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ user: { id: user._id, name: user.name, phone: user.phone, email: user.email, role: user.role }, token });
  } catch (err: any) {
    console.error('Login error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Return current user based on JWT in Authorization header
export const getMe = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
    const token = auth.slice(7);
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET as string);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const userId = payload.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err: any) {
    console.error('getMe error', err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
