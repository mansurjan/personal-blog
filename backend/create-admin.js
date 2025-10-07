const sqlite3 = require('sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Creating admin user...');

// Check if admin user exists
db.get('SELECT COUNT(*) as count FROM admin_users WHERE username = ?', ['admin'], (err, row) => {
  if (err) {
    console.error('❌ Error checking admin user:', err);
    db.close();
    return;
  }

  if (row.count > 0) {
    console.log('✅ Admin user already exists');
    db.close();
    return;
  }

  // Create admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  db.run(
    'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
    ['admin', hashedPassword],
    (err) => {
      if (err) {
        console.error('❌ Error creating admin user:', err);
      } else {
        console.log('✅ Admin user created successfully!');
        console.log('📝 Credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
      }
      db.close();
    }
  );
});
