import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function backendSyncPlugin(): Plugin {
  const dbFile = path.resolve(import.meta.dirname || process.cwd(), 'server_db.json');

  return {
    name: 'backend-sync-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/sync') {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            if (fs.existsSync(dbFile)) {
              try {
                const data = fs.readFileSync(dbFile, 'utf-8');
                return res.end(data);
              } catch (e) {}
            }
            return res.end(JSON.stringify({ posts: null, sidebarPages: null }));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                // Securing Admin API
                const providedPin = (req.headers['x-admin-pin'] || '').toString();
                let currentDbPin: string | null = null;
                if (fs.existsSync(dbFile)) {
                  try {
                    const existingData = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
                    if (existingData.adminPin) currentDbPin = existingData.adminPin;
                  } catch (e) {}
                }

                if (currentDbPin && providedPin !== currentDbPin) {
                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  return res.end(JSON.stringify({ error: 'Unauthorized: Invalid Admin PIN' }));
                }

                fs.writeFileSync(dbFile, body, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.end(JSON.stringify({ success: true, timestamp: Date.now() }));
              } catch (err) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: 'Failed to write to database' }));
              }
            });
            return;
          }
        } else if (req.url === '/api/register' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const newUser = JSON.parse(body);
              let existingData: any = { registeredUsers: [] };
              if (fs.existsSync(dbFile)) {
                try {
                  existingData = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
                } catch (e) {}
              }
              if (!existingData.registeredUsers) {
                existingData.registeredUsers = [];
              }
              
              const exists = existingData.registeredUsers.find((u: any) => u.email.toLowerCase() === newUser.email.toLowerCase());
              if (!exists) {
                existingData.registeredUsers.push(newUser);
                fs.writeFileSync(dbFile, JSON.stringify(existingData, null, 2), 'utf-8');
              }
              
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              return res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: 'Failed to register' }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), backendSyncPlugin()],
});
