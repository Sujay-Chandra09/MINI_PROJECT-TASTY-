const { MongoClient } = require('mongodb');
async function run() {
  const uri = "mongodb+srv://usrinivasulu2005_db_user:tRaucqoL5IB0V7j7@tastycluster.yobfruu.mongodb.net/";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('tastyDB');
  const recipe = await db.collection('recipes').findOne({});
  console.log(JSON.stringify(recipe, null, 2));
  await client.close();
}
run();
