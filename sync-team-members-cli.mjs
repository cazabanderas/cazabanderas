import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

const db_url = process.env.DATABASE_URL;
const token = process.env.HTB_API_TOKEN;

if (!db_url || !token) {
  console.error("Missing DATABASE_URL or HTB_API_TOKEN");
  process.exit(1);
}

async function main() {
  const connection = await mysql.createConnection(db_url);
  
  try {
    console.log("Fetching HTB team members...");
    const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const members = await response.json();
    console.log(`Found ${members.length} team members`);

    let added = 0;
    let updated = 0;

    for (const member of members) {
      // Check if exists
      const [existing] = await connection.execute(
        "SELECT id FROM htbTeamMembers WHERE htbUserId = ?",
        [member.id]
      );

      if (existing.length === 0) {
        // Insert
        await connection.execute(
          `INSERT INTO htbTeamMembers 
           (htbUserId, htbUsername, displayName, profilePictureUrl, isVisible, syncedAt) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [member.id, member.name, member.name, member.avatar, 1]
        );
        console.log(`✓ Added: ${member.name}`);
        added++;
      } else {
        // Update avatar if changed
        const [current] = await connection.execute(
          "SELECT profilePictureUrl FROM htbTeamMembers WHERE htbUserId = ?",
          [member.id]
        );
        if (current[0].profilePictureUrl !== member.avatar) {
          await connection.execute(
            "UPDATE htbTeamMembers SET profilePictureUrl = ?, syncedAt = NOW() WHERE htbUserId = ?",
            [member.avatar, member.id]
          );
          console.log(`✓ Updated: ${member.name}`);
          updated++;
        }
      }
    }

    console.log(`\n✓ Sync complete! Added: ${added}, Updated: ${updated}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
