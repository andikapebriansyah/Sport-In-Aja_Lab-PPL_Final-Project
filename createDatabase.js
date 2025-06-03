const mysql = require('mysql2');

// Create connection without database name
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

// Create database if not exists
connection.query('CREATE DATABASE IF NOT EXISTS sport_inaja', (err) => {
  if (err) {
    console.error('Error creating database:', err);
    return;
  }
  console.log('Database sport_inaja created successfully');
  connection.end();
}); 