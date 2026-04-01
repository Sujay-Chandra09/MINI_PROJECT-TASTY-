// Run: node trim_recipes.js
// Trims the database from 20,000 recipes down to 5,000
// Keeps recipes with the most likes/comments first

const http = require('http');

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

function deleteRequest(id) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8081,
      path: `/recipes/${id}`,
      method: 'DELETE',
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

async function trimRecipes() {
  console.log("🔍 Fetching all recipes...\n");

  // First fetch page 0 to get total count
  const firstRes = await makeRequest({
    hostname: 'localhost',
    port: 8081,
    path: '/recipes?page=0&size=1',
    method: 'GET',
    timeout: 120000
  });

  if (firstRes.status !== 200) {
    console.log("❌ Failed to fetch recipes. Is backend running?");
    return;
  }

  const firstData = JSON.parse(firstRes.body);
  const totalElements = firstData.totalElements || 0;
  const totalPages = firstData.totalPages || 0;
  console.log(`📦 Total recipes in database: ${totalElements}`);

  // Fetch ALL recipe IDs in batches
  console.log("📥 Fetching all recipe IDs...");
  let recipes = [];
  const PAGE_SIZE = 500;
  const pages = Math.ceil(totalElements / PAGE_SIZE);
  for (let p = 0; p < pages; p++) {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 8081,
      path: `/recipes?page=${p}&size=${PAGE_SIZE}`,
      method: 'GET',
      timeout: 120000
    });
    if (res.status === 200) {
      const data = JSON.parse(res.body);
      const content = data.content || [];
      recipes = recipes.concat(content);
      process.stdout.write(`\r  Fetched ${recipes.length} / ${totalElements}`);
    }
  }
  console.log(`\n📦 Fetched ${recipes.length} recipes total.`);

  const TARGET = 5000;

  if (recipes.length <= TARGET) {
    console.log(`✅ Already at or below ${TARGET} recipes. Nothing to do!`);
    return;
  }

  // Sort: keep recipes with most likes, comments, and valid images first
  recipes.sort((a, b) => {
    const scoreA = (a.likeCount || 0) * 3 + (a.comments?.length || 0) * 2 + (a.image?.startsWith('http') ? 1 : 0);
    const scoreB = (b.likeCount || 0) * 3 + (b.comments?.length || 0) * 2 + (b.image?.startsWith('http') ? 1 : 0);
    return scoreB - scoreA;
  });

  const keepRecipes = recipes.slice(0, TARGET);
  const deleteRecipes = recipes.slice(TARGET);
  const keepIds = new Set(keepRecipes.map(r => r.id));

  console.log(`🗑️  Need to delete ${deleteRecipes.length} recipes (keeping best ${TARGET})\n`);
  console.log("Deleting in batches of 100...\n");

  let deleted = 0;
  let failed = 0;

  // Delete in batches
  const BATCH_SIZE = 100;
  for (let i = 0; i < deleteRecipes.length; i += BATCH_SIZE) {
    const batch = deleteRecipes.slice(i, i + BATCH_SIZE);
    const promises = batch.map(r =>
      deleteRequest(r.id)
        .then(res => {
          if (res.status === 200 || res.status === 204) deleted++;
          else failed++;
        })
        .catch(() => failed++)
    );
    await Promise.all(promises);

    const progress = Math.min(i + BATCH_SIZE, deleteRecipes.length);
    const pct = ((progress / deleteRecipes.length) * 100).toFixed(1);
    process.stdout.write(`\r  Progress: ${progress}/${deleteRecipes.length} (${pct}%) — ✅ ${deleted} deleted, ❌ ${failed} failed`);
  }

  console.log(`\n\n🎉 Done! Deleted ${deleted} recipes. ${failed} failed.`);
  console.log(`📦 Database should now have ~${TARGET} recipes.`);
  console.log("Refresh your browser to see the faster loading!");
}

trimRecipes().catch(err => {
  console.error("Error:", err.message);
});
