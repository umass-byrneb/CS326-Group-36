import { User, Task } from '../models/index.js';
import bcrypt from 'bcrypt';

export async function register(req, res, next) {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullname, email, password: hash });
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
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    res.json({ id: user.id, fullname: user.fullname, email: user.email });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    await Task.destroy({ where: { owner: user.email } });
    await user.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
