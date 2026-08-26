#!/usr/bin/env node
/**
 * Bulk Import Script for NetlaxFree
 * ----------------------------------
 * Reads all .txt files from C:\Users\hanjl\Music\tool\Netflix\Alive\*
 * Parses each Deadflix checker output into a BlogPost card
 * Pushes them to the Vercel /api/sync endpoint
 *
 * Usage:
 *   node scripts/bulk-import.mjs                     → dry-run (preview)
 *   node scripts/bulk-import.mjs --push              → push to production
 *   node scripts/bulk-import.mjs --push --local      → push to localhost:5173
 *   node scripts/bulk-import.mjs --limit 10 --push   → import only first 10
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ───────── CONFIG ─────────
const SOURCE_DIR = 'C:\\Users\\hanjl\\Music\\tool\\Prime Cookie Checker v3.5\\results\\alive\\paid';
const PROD_API   = 'https://netlax-free-test11-2a2b.vercel.app/api/sync';
const LOCAL_API  = 'http://localhost:5173/api/sync';
const ADMIN_PIN  = 'Hanjla@786';

// Folders to skip
const SKIP_FOLDERS = new Set(['On Hold', 'Duplicate', 'Dead']);

// Map subfolder name → accountType for the card
const TIER_MAP = {
  'Premium':           'Prime',
  'Standard':          'Prime',
  'Basic':             'Free',
  'Free':              'Free',
  'Mobile':            'Free',
  'Standard With Ads': 'Free',
};

// Normalize localized plan names → English
const PLAN_NORMALIZE = {
  // Premium variants
  'cao cấp': 'PREMIUM', 'المميزة': 'PREMIUM', 'พรีเมียม': 'PREMIUM',
  'プレミアム': 'PREMIUM', '高級': 'PREMIUM', '프리미엄': 'PREMIUM',
  'premium': 'PREMIUM',
  // Standard variants
  'estándar': 'STANDARD', 'padrão': 'STANDARD', 'standaard': 'STANDARD',
  'standardowy': 'STANDARD', 'tiêu chuẩn': 'STANDARD', 'standar': 'STANDARD',
  'القياسية': 'STANDARD', 'standard': 'STANDARD',
  // Standard With Ads variants
  'estándar con anuncios': 'STANDARD WITH ADS', 'padrão com anúncios': 'STANDARD WITH ADS',
  'standard avec pub': 'STANDARD WITH ADS', 'standard-abo mit werbung': 'STANDARD WITH ADS',
  'الخطة القياسية مع إعلانات': 'STANDARD WITH ADS', '광고형 스탠다드': 'STANDARD WITH ADS',
  '広告つきスタンダード': 'STANDARD WITH ADS', 'standard with ads': 'STANDARD WITH ADS',
  // Basic variants
  'básico': 'BASIC', 'cơ bản': 'BASIC', 'dasar': 'BASIC', 'de base': 'BASIC',
  'essentiel': 'BASIC', 'podstawowy': 'BASIC', 'base': 'BASIC', 'basic': 'BASIC',
  // Free / Mobile
  'free': 'FREE', 'mobile': 'MOBILE', 'n/a': 'FREE',
};

// ───────── PARSE A SINGLE .txt FILE ─────────
function parseAccountFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/);

  // Extract metadata from lines like "– Country: US"
  const meta = {};
  const cookieLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip separator lines and headers
    if (trimmed.startsWith('═') || trimmed.startsWith('=')) continue;
    if (trimmed === '' || trimmed.startsWith('PRIME VIDEO') || trimmed.startsWith('SOFTWARE') || trimmed.startsWith('VERSION')) continue;

    // Cookie lines: tab-separated, start with a dot domain or domain name
    if ((/^\.\w+\./.test(trimmed) || /^\w+\.\w+\./.test(trimmed)) && trimmed.includes('\t')) {
      cookieLines.push(line);
      continue;
    }

    // Parse "– Key: Value" or "- Key: Value"
    const match = trimmed.match(/^[\s–\-]+\s*(.+?):\s*(.+)$/);
    if (match) {
      const key = match[1].trim().toLowerCase();
      const value = match[2].trim();
      meta[key] = value;
    }
  }

  // Extract email from filename: [Primevideo][email@example.com][IN]...
  // Or extract from Name in bracket
  const fnameMatch = path.basename(filePath).match(/\[([^\]]+)\]/g);
  let email = 'unknown@example.com';
  let country = meta['region'] || 'XX';
  
  if (fnameMatch && fnameMatch.length >= 3) {
    // Usually [Primevideo][Username/Email][Region]
    email = fnameMatch[1].replace(/[\[\]]/g, '');
    country = fnameMatch[2].replace(/[\[\]]/g, '');
  }

  // Build the Netscape cookie string
  const netscapeCookie = cookieLines.length > 0
    ? '# Netscape HTTP Cookie File\n' + cookieLines.join('\n')
    : '';

  // Determine plan tier
  const plan = 'Premium'; // Prime Video is usually just Prime Premium
  const accountType = 'Prime';

  // Build a unique stable ID
  const id = crypto.createHash('md5').update(`prime-${email}-${Date.now()}-${Math.random()}`).digest('hex').slice(0, 12);

  const expiresStr = meta['expires in'] || '30 days';
  let calculatedExpiryDays = 30;
  if (expiresStr.includes('days')) {
    calculatedExpiryDays = Math.max(3, parseInt(expiresStr) || 30);
  }

  return {
    id,
    title: `Prime Video Premium`,
    subtitle: `${country} Region • Prime Plan`,
    service: 'Prime Video',
    author: 'Admin',
    authorRole: 'System Import',
    date: new Date().toISOString().split('T')[0],
    readTime: '1 min',
    category: 'Streaming Tech',
    coverImage: '',
    excerpt: `Prime Video account – ${country} region`,
    content: '',
    ctaButtons: [],
    tags: ['Prime Video', 'Premium', country],
    isFeatured: false,
    likesCount: 0,
    viewsCount: 0,
    status: 'published',
    createdAt: new Date().toISOString(),

    // Account fields
    accountEmail: email,
    planTier: plan,
    countryCode: country,
    paymentMethod: 'Unknown',
    nextBillingCycle: 'N/A',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),

    // Cookie data
    netscapeConfig: netscapeCookie,
    cardFormat: 'cookie',
    accountType,
    expiryDays: calculatedExpiryDays, // Auto-delete imported cards based on billing
  };
}

// ───────── SCAN ALL FILES IN DIRECTORY ─────────
function scanAllFiles() {
  const results = [];
  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.txt'));

  console.log(`  📂 Prime Video: ${files.length} files`);

  for (const file of files) {
    try {
      const card = parseAccountFile(path.join(SOURCE_DIR, file));
      results.push(card);
    } catch (err) {
      console.error(`  ❌ Failed to parse: ${file} — ${err.message}`);
    }
  }

  return results;
}

// ───────── PUSH TO API ─────────
async function pushToAPI(cards, apiUrl) {
  // First fetch existing data
  console.log(`\n🔄 Fetching existing data from ${apiUrl}...`);
  const getRes = await fetch(apiUrl);
  const existing = await getRes.json();

  const existingPosts = existing.posts || [];
  const existingSidebarPages = existing.sidebarPages || [];
  const existingRegisteredUsers = existing.registeredUsers || [];
  const existingTelegram = existing.telegramUsername || 'netlaxfreevipsupport';

  // Remove previous bulk imported cards (to avoid duplicates)
  const manualPosts = existingPosts.filter(p => p.authorRole !== 'System Import');

  // Merge: add new cards to manual posts
  const mergedPosts = [...manualPosts, ...cards];

  console.log(`📊 Existing manual posts: ${manualPosts.length}`);
  console.log(`📊 Old imported posts removed: ${existingPosts.length - manualPosts.length}`);
  console.log(`📊 New cards: ${cards.length}`);
  console.log(`📊 Total after merge: ${mergedPosts.length}`);

  // Push merged data
  console.log(`\n🚀 Pushing ${mergedPosts.length} total posts to ${apiUrl}...`);
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-pin': ADMIN_PIN,
    },
    body: JSON.stringify({
      posts: mergedPosts,
      sidebarPages: existingSidebarPages,
      registeredUsers: existingRegisteredUsers,
      telegramUsername: existingTelegram,
      adminPin: ADMIN_PIN,
    }),
  });

  if (res.ok) {
    const json = await res.json();
    console.log(`✅ Success! Server responded:`, json);
  } else {
    const text = await res.text();
    console.error(`❌ Push failed (${res.status}): ${text}`);
  }
}

// ───────── MAIN ─────────
async function main() {
  const args = process.argv.slice(2);
  const shouldPush = args.includes('--push');
  const useLocal = args.includes('--local');
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;

  console.log('╔══════════════════════════════════════╗');
  console.log('║   NetlaxFree Bulk Import Tool v1.0   ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`\n📁 Source: ${SOURCE_DIR}`);
  console.log(`🎯 Mode: ${shouldPush ? 'PUSH' : 'DRY-RUN (add --push to actually upload)'}`);
  if (limit < Infinity) console.log(`🔢 Limit: ${limit} cards`);
  console.log('');

  // Scan files
  const allCards = scanAllFiles();

  // Apply limit
  const cards = allCards.slice(0, limit);

  console.log(`\n📋 Total parsed: ${allCards.length} cards`);
  if (limit < Infinity) console.log(`🔢 Limited to: ${cards.length} cards`);

  // Show a sample
  if (cards.length > 0) {
    console.log(`\n📄 Sample card:`);
    const sample = cards[0];
    console.log(`   Title: ${sample.title}`);
    console.log(`   Email: ${sample.accountEmail}`);
    console.log(`   Country: ${sample.countryCode}`);
    console.log(`   Plan: ${sample.planTier}`);
    console.log(`   Type: ${sample.accountType}`);
    console.log(`   Cookie: ${sample.netscapeConfig ? sample.netscapeConfig.substring(0, 80) + '...' : 'NONE'}`);
  }

  // Show tier breakdown
  const tierCounts = {};
  for (const card of cards) {
    tierCounts[card.planTier] = (tierCounts[card.planTier] || 0) + 1;
  }
  console.log(`\n📊 Breakdown by plan tier:`);
  for (const [tier, count] of Object.entries(tierCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${tier}: ${count}`);
  }

  if (shouldPush) {
    const apiUrl = useLocal ? LOCAL_API : PROD_API;
    await pushToAPI(cards, apiUrl);
  } else {
    console.log(`\n💡 Dry-run complete. Run with --push to upload.`);
    console.log(`   node scripts/bulk-import.mjs --push`);
    console.log(`   node scripts/bulk-import.mjs --push --limit 10  (test with 10 first)`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
