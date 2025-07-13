import db from '../db/connection.js';

async function addNameColumn() {
  try {
    // Check if name column exists
    db.query(
      "SHOW COLUMNS FROM users LIKE 'name'",
      (err, results) => {
        if (err) {
          console.error('Error checking column:', err);
          return;
        }
        
        if (results.length > 0) {
          console.log('Name column already exists!');
          process.exit(0);
          return;
        }
        
        // Add name column
        db.query(
          'ALTER TABLE users ADD COLUMN name VARCHAR(255) AFTER username',
          (err, result) => {
            if (err) {
              console.error('Error adding column:', err);
              return;
            }
            
            console.log('✅ Name column added successfully!');
            
            // Update existing test user with a name
            db.query(
              "UPDATE users SET name = 'Admin User' WHERE username = 'admin@suvidha.org'",
              (err, result) => {
                if (err) {
                  console.error('Error updating test user:', err);
                } else {
                  console.log('✅ Test user updated with name!');
                }
                process.exit(0);
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addNameColumn();
