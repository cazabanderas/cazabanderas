import { getDb } from '../db.ts';
import { teamMembers, teamCredentials } from '../../drizzle/schema.ts';
import bcrypt from 'bcryptjs';

async function addTeamMember() {
  const db = await getDb();
  if (!db) {
    console.error('Database connection failed');
    process.exit(1);
  }

  try {
    // Insert team member
    const result = await db.insert(teamMembers).values({
      displayName: 'aw0ken',
      specialty: 'Founder / Owner',
      openId: 'aw0ken',
      isApproved: 1,
    });

    const teamMemberId = result[0].insertId;
    console.log(`✓ Team member created with ID: ${teamMemberId}`);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('&1HXb*Jl&3#70^80N&o$', salt);

    // Insert credentials
    await db.insert(teamCredentials).values({
      teamMemberId,
      username: 'aw0ken@cazabanderas.team',
      passwordHash,
      isActive: 1,
    });

    console.log('✓ Credentials created successfully');
    console.log('\nTeam Member Added:');
    console.log('  Name: aw0ken');
    console.log('  Username: aw0ken@cazabanderas.team');
    console.log('  Role: Founder / Owner');
    console.log('  Status: Approved');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTeamMember();
