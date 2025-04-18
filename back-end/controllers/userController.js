import { FileUserModel } from '../models/fileUserModel.js';

export async function register(req, res, next) {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const exists = await FileUserModel.findByEmail(email);
    if (exists) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const user = await FileUserModel.create({ fullname, email, password });
    res.status(201).json({ id: user.id, fullname: user.fullname, email: user.email });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }
    const user = await FileUserModel.findByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    res.json({ id: user.id, fullname: user.fullname, email: user.email });
  } catch (err) {
    next(err);
  }
}
