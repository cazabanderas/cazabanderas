import { describe, it, expect } from "vitest";

describe("HTB Team Members Sync", () => {
  it("should validate HTB API token is configured", () => {
    const token = process.env.HTB_API_TOKEN;
    expect(token).toBeDefined();
    expect(token).toBeTruthy();
    expect(token!.length).toBeGreaterThan(0);
  });

  it("should fetch HTB team members from API", async () => {
    const token = process.env.HTB_API_TOKEN;
    expect(token).toBeDefined();

    const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    expect(response.status).toBeLessThan(400);

    let members;
    try {
      members = await response.json();
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      throw e;
    }
    expect(Array.isArray(members) || typeof members === "object").toBe(true);

    // Verify member structure
    if (Array.isArray(members) && members.length > 0) {
      const firstMember = members[0];
      expect(firstMember).toHaveProperty("id");
      expect(firstMember).toHaveProperty("name");
      expect(firstMember).toHaveProperty("avatar");
      expect(typeof firstMember.id).toBe("number");
      expect(typeof firstMember.name).toBe("string");
      expect(typeof firstMember.avatar).toBe("string");
    }
  });

  it("should have valid avatar URLs in team members", async () => {
    const token = process.env.HTB_API_TOKEN;
    const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const members = await response.json();
    members.forEach((member: any) => {
      // Avatar can be an object with url property or a string
      const avatarUrl = typeof member.avatar === 'string' ? member.avatar : member.avatar?.url;
      if (avatarUrl) {
        expect(avatarUrl).toMatch(/^https?:\/\//);
      }
    });
  });

  it("should have at least one team member", async () => {
    const token = process.env.HTB_API_TOKEN;
    const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const members = await response.json();
    expect(members.length).toBeGreaterThanOrEqual(1);
  });

  it("should have unique member IDs", async () => {
    const token = process.env.HTB_API_TOKEN;
    const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const members = await response.json();
    const ids = members.map((m: any) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have non-empty member names", async () => {
    const token = process.env.HTB_API_TOKEN;
    const response = await fetch("https://labs.hackthebox.com/api/v4/team/members/8179", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const members = await response.json();
    members.forEach((member: any) => {
      expect(member.name).toBeTruthy();
      expect(member.name.length).toBeGreaterThan(0);
    });
  });
});
