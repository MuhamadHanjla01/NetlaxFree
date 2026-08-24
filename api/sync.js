// Vercel Serverless Function for /api/sync
let globalStore = {
  posts: [],
  registeredUsers: [],
  telegramUsername: "netlaxfreevipsupport",
  adminPin: "Hanjla@786"
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).json(globalStore);
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (data) {
        if (data.posts !== undefined) globalStore.posts = data.posts;
        if (data.sidebarPages !== undefined) globalStore.sidebarPages = data.sidebarPages;
        if (data.registeredUsers !== undefined) globalStore.registeredUsers = data.registeredUsers;
        if (data.adminPin !== undefined) globalStore.adminPin = data.adminPin;
        if (data.telegramUsername !== undefined) globalStore.telegramUsername = data.telegramUsername;
      }
      return res.status(200).json({ success: true, timestamp: Date.now(), telegramUsername: globalStore.telegramUsername });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update sync data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
