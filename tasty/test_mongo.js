const { MongoClient } = require('mongodb');
async function run() {
  const uri = "mongodb://localhost:27017/";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('tastyDB');
  const recipe = await db.collection('recipes').findOne({});
  console.log(JSON.stringify(recipe, null, 2));
  await client.close();
}
run();
