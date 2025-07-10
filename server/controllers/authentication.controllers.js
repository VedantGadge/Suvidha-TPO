import db from '../db/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 11);
    db.query(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'User registered', id: result.insertId });
        }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signInUser = (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '20m' }
      );

      res.json({
        message: 'Login successful',
        token,
      });
    }
  );
};