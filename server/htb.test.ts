import { describe, it, expect } from 'vitest';

describe('HackTheBox API Integration', () => {
  it('should validate HTB API token by fetching team activity', async () => {
    const token = process.env.HTB_API_TOKEN;
    expect(token).toBeDefined();
    expect(token).toBeTruthy();

    // Test the API endpoint with the token
    const response = await fetch('https://labs.hackthebox.com/api/v4/team/activity/8179', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    expect(response.status).toBe(200);
    expect(data).toBeDefined();
    expect(typeof data === 'object').toBe(true);
  });
});
