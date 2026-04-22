import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const challenges = [
  // OSINT: 6
  { name: 'The Puppet Master', category: 'OSINT', difficulty: 'Medium', points: 20 },
  { name: 'Social Media Investigation Hub', category: 'OSINT', difficulty: 'Easy', points: 10 },
  { name: 'The Suspicious Domain', category: 'OSINT', difficulty: 'Medium', points: 20 },
  { name: 'The Suspicious Reviewer', category: 'OSINT', difficulty: 'Easy', points: 10 },
  { name: 'Follow The Money', category: 'OSINT', difficulty: 'Hard', points: 30 },
  { name: 'WebVault Time Machine Investigation', category: 'OSINT', difficulty: 'Medium', points: 20 },
  
  // Reversing: 2 (note: user said 3 challenges but 2 count)
  { name: 'Tear Or Dear', category: 'Reversing', difficulty: 'Easy', points: 10 },
  { name: 'SpookyPass', category: 'Reversing', difficulty: 'Medium', points: 20 },
  { name: 'Simple Encryptor', category: 'Reversing', difficulty: 'Easy', points: 10 },
  
  // Secure Coding: 4
  { name: 'Powergrid', category: 'Secure Coding', difficulty: 'Hard', points: 30 },
  { name: 'Hydroadmin', category: 'Secure Coding', difficulty: 'Medium', points: 20 },
  { name: 'Resourcehub Core', category: 'Secure Coding', difficulty: 'Medium', points: 20 },
  { name: 'Commnet', category: 'Secure Coding', difficulty: 'Hard', points: 30 },
  
  // Web: 4
  { name: 'POP Restaurant', category: 'Web', difficulty: 'Easy', points: 10 },
  { name: 'ApacheBlaze', category: 'Web', difficulty: 'Medium', points: 20 },
  { name: 'Flag Command', category: 'Web', difficulty: 'Medium', points: 20 },
  { name: 'Magical Palindrome', category: 'Web', difficulty: 'Easy', points: 10 },
  
  // Blockchain: 1
  { name: 'Survival of the Fittest', category: 'Blockchain', difficulty: 'Hard', points: 30 },
  
  // Hardware: 2
  { name: 'Debugging Interface', category: 'Hardware', difficulty: 'Medium', points: 20 },
  { name: 'Low Logic', category: 'Hardware', difficulty: 'Easy', points: 10 },
  
  // Misc: 1
  { name: 'Emdee five for life', category: 'Misc', difficulty: 'Easy', points: 10 },
  
  // Forensics: 1
  { name: 'MarketDump', category: 'Forensics', difficulty: 'Medium', points: 20 },
  
  // Coding: 2
  { name: 'Evaluative', category: 'Coding', difficulty: 'Easy', points: 10 },
  { name: 'Primed for Action', category: 'Coding', difficulty: 'Medium', points: 20 },
  
  // Crypto: 1
  { name: 'BabyEncryption', category: 'Crypto', difficulty: 'Easy', points: 10 },
  
  // AI/ML: 1
  { name: 'AI SPACE', category: 'AI/ML', difficulty: 'Medium', points: 20 },
  
  // GamePwn: 1
  { name: 'CubeMadness1', category: 'GamePwn', difficulty: 'Medium', points: 20 },
  
  // Mobile: 3
  { name: 'Don\'t Overreact', category: 'Mobile', difficulty: 'Easy', points: 10 },
  { name: 'FastJson and Furious', category: 'Mobile', difficulty: 'Medium', points: 20 },
  { name: 'Arno', category: 'Mobile', difficulty: 'Hard', points: 30 },
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('Seeding challenges...');
    
    for (const challenge of challenges) {
      try {
        await connection.execute(
          'INSERT INTO completedChallenges (challengeName, category, difficulty, points) VALUES (?, ?, ?, ?)',
          [challenge.name, challenge.category, challenge.difficulty, challenge.points]
        );
        console.log(`✓ Added: ${challenge.name} (${challenge.category})`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠ Already exists: ${challenge.name}`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('\n✓ Seeding complete!');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM completedChallenges');
    console.log(`Total challenges in database: ${rows[0].count}`);
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);
