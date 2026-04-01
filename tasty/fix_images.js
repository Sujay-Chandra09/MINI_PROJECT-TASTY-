// Run: node fix_images.js
// Updates all recipes in the database with working food images

const http = require('http');

// High-quality Unsplash food images (direct URLs that always work)
const foodImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop",
];

// Keyword-based image matching for better relevance
const keywordImages = {
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop',
  'chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
  'butter': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop',
  'paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop',
  'rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
  'fried rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
  'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
  'noodle': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=600&fit=crop',
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
  'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
  'curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop',
  'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
  'dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop',
  'idli': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&h=600&fit=crop',
  'fish': 'https://images.unsplash.com/photo-1626508035297-0cd84c457d10?w=800&h=600&fit=crop',
  'egg': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop',
  'taco': 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop',
  'sandwich': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&h=600&fit=crop',
  'wrap': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop',
  'burger': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
  'dessert': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
  'cake': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
  'smoothie': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop',
  'bowl': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
  'stir fry': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
  'mushroom': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
  'spinach': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop',
  'rajma': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
  'chole': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&h=600&fit=crop',
  'tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop',
  'maggi': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=600&fit=crop',
  'vegetable': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
  'potato': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop',
  'aloo': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop',
  'ham': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  'steak': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  'mahi': 'https://images.unsplash.com/photo-1626508035297-0cd84c457d10?w=800&h=600&fit=crop',
  'casserole': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop',
  'kumquat': 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&h=600&fit=crop',
  'fruit': 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&h=600&fit=crop',
  'spicy': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop',
  'terrine': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=600&fit=crop',
  'fennel': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
  'lentil': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
  'turkey': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  'blt': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&h=600&fit=crop',
};

function getImageForTitle(title) {
  const lower = title.toLowerCase();
  for (const [keyword, url] of Object.entries(keywordImages)) {
    if (lower.includes(keyword)) return url;
  }
  // Random fallback from general food images
  return foodImages[Math.floor(Math.random() * foodImages.length)];
}

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    if (data) req.write(data);
    req.end();
  });
}

async function fixImages() {
  console.log("🔍 Fetching all recipes from backend...\n");

  // Step 1: Get all recipes
  const allRecipes = await makeRequest({
    hostname: 'localhost',
    port: 8081,
    path: '/recipes',
    method: 'GET',
    timeout: 60000
  });

  if (allRecipes.status !== 200) {
    console.log("❌ Failed to fetch recipes. Is the backend running on port 8081?");
    return;
  }

  const recipes = JSON.parse(allRecipes.body);
  console.log(`📦 Found ${recipes.length} recipes. Updating images...\n`);

  let updated = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    const currentImage = recipe.image || '';
    const isValidImage = currentImage.startsWith('http') &&
                         (currentImage.includes('unsplash') || currentImage.includes('imgur') || currentImage.includes('.jpg') || currentImage.includes('.png'));

    if (isValidImage && !currentImage.includes('undefined')) {
      // Image already looks valid, skip
      skipped++;
      continue;
    }

    // Assign a relevant image based on title
    const newImage = getImageForTitle(recipe.title);
    recipe.image = newImage;

    // Update via POST (re-save with same ID)
    const data = JSON.stringify(recipe);
    try {
      const res = await makeRequest({
        hostname: 'localhost',
        port: 8081,
        path: '/recipes',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        },
        timeout: 30000
      }, data);

      if (res.status === 200 || res.status === 201) {
        console.log(`  ✅ ${recipe.title} → image updated`);
        updated++;
      } else {
        console.log(`  ❌ ${recipe.title} → HTTP ${res.status}`);
      }
    } catch (err) {
      console.log(`  ❌ ${recipe.title} → ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! ${updated} images updated, ${skipped} already had valid images.`);
  console.log("Refresh your browser at http://localhost:5173 to see the images!");
}

fixImages().catch(err => {
  console.error("Error:", err.message);
  console.log("\nMake sure the backend is running: cd TastyBackend/tasty && .\\mvnw.cmd spring-boot:run");
});
