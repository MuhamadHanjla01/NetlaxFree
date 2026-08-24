// Vercel Serverless Function for /api/sync
// Secure SaaS-grade API with PIN authentication and field stripping

let globalStore = {
  posts: [],
  sidebarPages: [],
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

  // GET — Public read (sensitive fields stripped)
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    // Strip passwords from registeredUsers and never expose adminPin
    const safeUsers = (globalStore.registeredUsers || []).map(u => {
      const { password, ...rest } = u;
      return rest;
    });

    return res.status(200).json({
      posts: globalStore.posts,
      sidebarPages: globalStore.sidebarPages,
      registeredUsers: safeUsers,
      telegramUsername: globalStore.telegramUsername,
      // adminPin is NEVER sent to the client via GET
    });
  }

  // POST — Admin-only write (requires valid PIN in header)
  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!data) {
        return res.status(400).json({ error: 'Empty request body' });
      }

      // Authenticate: x-admin-pin header must match stored adminPin
      const submittedPin = req.headers['x-admin-pin'];
      if (!submittedPin || submittedPin !== globalStore.adminPin) {
        // Also allow if they are sending a new adminPin and the old one matches
        // (PIN change flow: old pin in header, new pin in body)
        return res.status(401).json({ error: 'Unauthorized: Invalid admin PIN' });
      }

      // Authorized — apply updates
      if (data.posts !== undefined) globalStore.posts = data.posts;
      if (data.sidebarPages !== undefined) globalStore.sidebarPages = data.sidebarPages;
      if (data.registeredUsers !== undefined) globalStore.registeredUsers = data.registeredUsers;
      if (data.telegramUsername !== undefined) globalStore.telegramUsername = data.telegramUsername;

      // PIN change: update adminPin AFTER auth check passes with old pin
      if (data.adminPin !== undefined && typeof data.adminPin === 'string' && data.adminPin.trim().length > 0) {
        globalStore.adminPin = data.adminPin;
      }

      return res.status(200).json({
        success: true,
        timestamp: Date.now(),
        telegramUsername: globalStore.telegramUsername,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update sync data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
