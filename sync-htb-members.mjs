import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import * as schema from "./drizzle/schema.ts";

async function main() {
  let connection;
  try {
    const token = process.env.HTB_API_TOKEN;
    if (!token) {
      throw new Error("HTB_API_TOKEN not configured");
    }

    // Create connection pool
    connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection, { schema });

    console.log("Fetching HTB team members...");
    const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTB API error: ${response.status}`);
    }

    const members = await response.json();
    console.log(`Found ${members.length} team members on HTB`);

    let newMembersAdded = 0;
    let membersUpdated = 0;

    for (const member of members) {
      // Check if member already exists
      const existing = await db
        .select()
        .from(schema.htbTeamMembers)
        .where(eq(schema.htbTeamMembers.htbUserId, member.id))
        .limit(1);

      if (existing.length === 0) {
        // Add new member
        await db.insert(schema.htbTeamMembers).values({
          htbUserId: member.id,
          htbUsername: member.name,
          displayName: member.name,
          profilePictureUrl: member.avatar,
          isVisible: 1,
          syncedAt: new Date(),
        });
        console.log(`✓ Added: ${member.name}`);
        newMembersAdded++;
      } else {
        // Update existing member's profile picture if changed
        if (existing[0].profilePictureUrl !== member.avatar) {
          await db
            .update(schema.htbTeamMembers)
            .set({
              profilePictureUrl: member.avatar,
              syncedAt: new Date(),
            })
            .where(eq(schema.htbTeamMembers.htbUserId, member.id));
          console.log(`✓ Updated: ${member.name}`);
          membersUpdated++;
        }
      }
    }

    console.log(`\n✓ Sync complete!`);
    console.log(`  Added: ${newMembersAdded}`);
    console.log(`  Updated: ${membersUpdated}`);
  } catch (error) {
    console.error("Error syncing HTB team members:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
