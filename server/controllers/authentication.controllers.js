import db from '../db/connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// Input validation middleware
export const validateRegister = [
  body('username')
    .isEmail()
    .normalizeEmail()
    .withMessage('Username must be a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
];

export const validateLogin = [
  body('username')
    .isEmail()
    .normalizeEmail()
    .withMessage('Username must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateUpdateProfile = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
];

export const registerUser = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, password, name } = req.body;

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id FROM users WHERE username = ?',
        [username],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    
    const result = await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)',
        [username, hashedPassword, name || username.split('@')[0]],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      id: result.insertId 
    });

  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Registration error:', err);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const signInUser = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { username, password } = req.body;

    const results = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

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
      { expiresIn: process.env.JWT_EXPIRES_IN || '20m' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name || user.username
      }
    });

  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Login error:', err);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const results = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id, username, name FROM users WHERE id = ?',
        [userId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: results[0] });

  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Get user error:', err);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const userId = req.user.id;
    const { name } = req.body;

    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE users SET name = ? WHERE id = ?',
        [name.trim(), userId],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return updated user data
    const updatedUser = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id, username, name FROM users WHERE id = ?',
        [userId],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Update profile error:', err);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};