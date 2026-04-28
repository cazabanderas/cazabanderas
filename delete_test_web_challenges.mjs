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
  // Get all test challenges in Web category
  const [rows] = await connection.execute(
    "SELECT id, challengeName FROM completedChallenges WHERE category = 'Web' AND challengeName LIKE 'Test Challenge%'"
  );
  
  console.log(`Found ${rows.length} test challenges in Web category:`);
  rows.forEach(row => {
    console.log(`- ${row.challengeName} (ID: ${row.id})`);
  });
  
  // Delete each one
  for (const row of rows) {
    await connection.execute(
      'DELETE FROM completedChallenges WHERE id = ?',
      [row.id]
    );
    console.log(`✓ Deleted: ${row.challengeName}`);
  }
  
  console.log('\n✓ Done! All test challenges removed.');
} catch (err) {
  console.error('Error:', err.message);
} finally {
  await connection.end();
  process.exit(0);
}
