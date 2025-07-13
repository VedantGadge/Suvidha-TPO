import db from '../db/connection.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    // Test user credentials
    const username = 'admin@suvidha.org';
    const password = 'admin123';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 11);
    
    // Check if user already exists
    db.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, results) => {
        if (err) {
          console.error('Error checking user:', err);
          return;
        }
        
        if (results.length > 0) {
          console.log('Test user already exists!');
          console.log('Username:', username);
          console.log('Password:', password);
          return;
        }
        
        // Create the test user
        db.query(
          'INSERT INTO users (username, password_hash) VALUES (?, ?)',
          [username, hashedPassword],
          (err, result) => {
            if (err) {
              console.error('Error creating user:', err);
              return;
            }
            
            console.log('✅ Test user created successfully!');
            console.log('Username:', username);
            console.log('Password:', password);
            console.log('User ID:', result.insertId);
            
            process.exit(0);
          }
        );
      }
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestUser();
