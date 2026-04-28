import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'gateway05.us-east-1.prod.aws.tidbcloud.com',
  user: '3eyyrbRcoHzdLb4.root',
  password: '3QitriQ0GuSQI10id05u',
  database: 'fQrwPhmvRnJkdAC8zKsvoi',
  ssl: {
    rejectUnauthorized: false
  },
  port: 4000
});

try {
  // Get all test challenges in Web category (using correct column name)
  const [rows] = await connection.execute(
    "SELECT id, challengeName FROM completedChallenges WHERE category = 'Web' AND challengeName LIKE 'Test Challenge%'"
  );
  
  console.log(`Remaining test challenges in Web category: ${rows.length}`);
  if (rows.length > 0) {
    rows.forEach(row => {
      console.log(`- ${row.challengeName} (ID: ${row.id})`);
    });
  } else {
    console.log('✓ All test challenges have been removed!');
  }
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await connection.end();
  process.exit(0);
}
