const { MongoClient } = require('mongodb');

async function run() {
  const uri = "mongodb+srv://usrinivasulu2005_db_user:tRaucqoL5IB0V7j7@tastycluster.yobfruu.mongodb.net/";
  const client = new MongoClient(uri);

  const updates = [
    { title: "Lentil, Apple, and Turkey Wrap", image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg" },
    { title: "Boudin Blanc Terrine with Red Onion Confit", image: "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg" },
    { title: "Potato and Fennel Soup", image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg" },
    { title: "Mahi-Mahi in Tomato Olive Sauce", image: "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg" },
    { title: "Spinach Noodle Casserole", image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg" },
    { title: "The Best BLTs", image: "https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg" },
    { title: "Ham and Spring Vegetable Salad with Shallot Vinaigrette", image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg" },
    { title: "Spicy-Sweet Kumquats", image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg" },
    { title: "Korean Marinated Beef", image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg" },
    { title: "Ham Persillade with Mustard Potato Salad and Mashed Peas", image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg" },
    { title: "Yams Braised with Cream, Rosemary and Nutmeg", image: "https://images.pexels.com/photos/4110008/pexels-photo-4110008.jpeg" },
    { title: "Spicy Noodle Soup", image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg" },
    { title: "Banana-Chocolate Chip Cake With Peanut Butter Frosting", image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg" },
    { title: "Beef Tenderloin with Garlic and Brandy", image: "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg" },
    { title: "Peach Mustard", image: "https://assets.bonappetit.com/photos/5b02f9022cec8e322ee4837f/1:1/w_2560,c_limit/peach-mustard-sauce.jpg" },
    { title: "Raw Cream of Spinach Soup", image: "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg" },
    { title: "Sweet Buttermilk Spoon Breads", image: "https://images.pexels.com/photos/1756061/pexels-photo-1756061.jpeg" },
    { title: "Crisp Braised Pork Shoulder", image: "https://images.immediate.co.uk/production/volatile/sites/30/2022/01/Roast-Pork-Shoulder-686b22a.jpg" },
    { title: "Mozzarella-Topped Peppers with Tomatoes and Garlic", image: "https://www.allrecipes.com/thmb/YT42IgbDvUCYnjxj2ycN21Vr628=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AR-236359-beef-and-rice-stuffed-bell-peppers-DDMFS-4x3-beauty-dd9458de98884d4eb362354ee626d70e.jpg" },
    { title: "Tuna, Asparagus, and New Potato Salad with Chive Vinaigrette", image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg" }
  ];

  try {
    await client.connect();
    const db = client.db('tastyDB');
    const collection = db.collection('recipes');

    let totalUpdated = 0;
    for (const update of updates) {
      const result = await collection.updateOne(
        { title: update.title },
        { $set: { image: update.image } }
      );
      if (result.matchedCount > 0) {
        console.log(`Matched: ${update.title}, Modified: ${result.modifiedCount}`);
        totalUpdated += result.modifiedCount;
      } else {
        console.log(`Did not find recipe for: ${update.title}`);
      }
    }
    console.log(`Total recipes updated: ${totalUpdated}`);
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();
