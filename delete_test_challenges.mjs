import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

const trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
      transformer: superjson,
      fetch(input, init) {
        return fetch(input, {
          ...(init ?? {}),
          credentials: 'include',
        });
      },
    }),
  ],
});

// Query to get all test challenges in Web category
const challenges = await trpc.htb.getAllChallenges.query();
const testWebChallenges = challenges.filter(
  c => c.category === 'Web' && c.name.includes('Test Challenge')
);

console.log(`Found ${testWebChallenges.length} test challenges in Web category:`);
testWebChallenges.forEach(c => {
  console.log(`- ${c.name} (ID: ${c.id})`);
});

// Delete each one
for (const challenge of testWebChallenges) {
  try {
    await trpc.htb.deleteChallenge.mutate({ id: challenge.id });
    console.log(`✓ Deleted: ${challenge.name}`);
  } catch (err) {
    console.error(`✗ Failed to delete ${challenge.name}:`, err.message);
  }
}

console.log('\nDone!');
process.exit(0);
