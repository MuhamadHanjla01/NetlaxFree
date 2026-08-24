// Vercel Serverless Function for /api/register
// Handles user registration from UserAuthModal

// Import the global store from sync.js is not possible in serverless (each function is isolated),
// so we maintain a reference. In production, this would use a real database.
// For now, register endpoint stores locally and the sync POST merges on next admin push.

let registeredUsersStore = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      if (!data || !data.email || !data.name) {
        return res.status(400).json({ error: 'Missing required fields: name, email' });
      }

      // Check for duplicate email
      const existing = registeredUsersStore.find(
        u => u.email && u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (existing) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      const newUser = {
        id: data.id || `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        password: data.password || '',
        accountTier: data.accountTier || 'Free',
        createdAt: data.createdAt || new Date().toISOString(),
        isBanned: false,
        unlockedServices: [],
      };

      registeredUsersStore.push(newUser);

      // Return user without password
      const { password, ...safeUser } = newUser;
      return res.status(201).json({ success: true, user: safeUser });
    } catch (err) {
      return res.status(500).json({ error: 'Registration failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
