// Run this script: node seed_recipes.js
// It seeds 20 sample recipes into your MongoDB Atlas

const http = require('http');

const recipes = [
  {
    title: "Chicken Biryani",
    type: "Non-Veg",
    cuisine: "Indian",
    calories: 450,
    protein: 30,
    cookingTime: 60,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800",
    ingredients: [
      { name: "Basmati Rice", quantity: 2, unit: "cups", price: 60 },
      { name: "Chicken", quantity: 500, unit: "grams", price: 200 },
      { name: "Onion", quantity: 3, unit: "pieces", price: 30 },
      { name: "Yogurt", quantity: 1, unit: "cup", price: 25 },
      { name: "Biryani Masala", quantity: 2, unit: "tbsp", price: 20 },
      { name: "Ghee", quantity: 3, unit: "tbsp", price: 40 },
      { name: "Salt", quantity: 1, unit: "tsp", price: 2 }
    ],
    directions: [
      "Marinate chicken with yogurt, biryani masala, and salt for 30 minutes.",
      "Soak basmati rice for 20 minutes, then parboil until 70% done.",
      "Fry sliced onions in ghee until golden brown.",
      "Layer marinated chicken at the bottom of a heavy pot.",
      "Add a layer of parboiled rice on top of the chicken.",
      "Top with fried onions, saffron milk, and ghee.",
      "Seal the pot and cook on low heat (dum) for 25 minutes.",
      "Gently mix and serve hot with raita."
    ],
    likeCount: 12,
    likedBy: [],
    comments: []
  },
  {
    title: "Paneer Butter Masala",
    type: "Veg",
    cuisine: "Indian",
    calories: 350,
    protein: 18,
    cookingTime: 35,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
    ingredients: [
      { name: "Paneer", quantity: 250, unit: "grams", price: 80 },
      { name: "Tomato", quantity: 4, unit: "pieces", price: 20 },
      { name: "Butter", quantity: 3, unit: "tbsp", price: 30 },
      { name: "Cream", quantity: 100, unit: "ml", price: 40 },
      { name: "Onion", quantity: 2, unit: "pieces", price: 15 },
      { name: "Ginger Garlic Paste", quantity: 1, unit: "tbsp", price: 10 },
      { name: "Garam Masala", quantity: 1, unit: "tsp", price: 5 }
    ],
    directions: [
      "Blanch tomatoes and blend into a smooth puree.",
      "Heat butter, sauté onions until golden, add ginger garlic paste.",
      "Add tomato puree and cook until oil separates.",
      "Add garam masala, salt, and sugar. Simmer for 5 minutes.",
      "Add cream and mix well.",
      "Add paneer cubes and simmer for 5 minutes.",
      "Garnish with cream and coriander leaves. Serve with naan."
    ],
    likeCount: 18,
    likedBy: [],
    comments: []
  },
  {
    title: "Veg Fried Rice",
    type: "Veg",
    cuisine: "Chinese",
    calories: 280,
    protein: 8,
    cookingTime: 20,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
    ingredients: [
      { name: "Rice", quantity: 2, unit: "cups", price: 40 },
      { name: "Carrot", quantity: 1, unit: "piece", price: 10 },
      { name: "Capsicum", quantity: 1, unit: "piece", price: 15 },
      { name: "Spring Onion", quantity: 4, unit: "stalks", price: 10 },
      { name: "Soy Sauce", quantity: 2, unit: "tbsp", price: 10 },
      { name: "Oil", quantity: 2, unit: "tbsp", price: 10 },
      { name: "Salt", quantity: 1, unit: "tsp", price: 2 }
    ],
    directions: [
      "Cook rice and spread on a plate to cool completely.",
      "Heat oil in a wok on high heat.",
      "Add diced carrots and capsicum, stir-fry for 2 minutes.",
      "Add cold rice and toss well.",
      "Add soy sauce and salt, stir-fry for 3 minutes.",
      "Garnish with spring onions and serve hot."
    ],
    likeCount: 8,
    likedBy: [],
    comments: []
  },
  {
    title: "Masala Dosa",
    type: "Veg",
    cuisine: "South Indian",
    calories: 220,
    protein: 6,
    cookingTime: 25,
    image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800",
    ingredients: [
      { name: "Dosa Batter", quantity: 2, unit: "cups", price: 40 },
      { name: "Potato", quantity: 3, unit: "pieces", price: 20 },
      { name: "Onion", quantity: 2, unit: "pieces", price: 15 },
      { name: "Mustard Seeds", quantity: 1, unit: "tsp", price: 3 },
      { name: "Turmeric", quantity: 1, unit: "tsp", price: 3 },
      { name: "Curry Leaves", quantity: 8, unit: "leaves", price: 2 },
      { name: "Oil", quantity: 2, unit: "tbsp", price: 10 }
    ],
    directions: [
      "Boil and mash potatoes. Keep aside.",
      "Heat oil, add mustard seeds and curry leaves. Let them splutter.",
      "Add sliced onions and sauté until soft.",
      "Add turmeric, salt, and mashed potatoes. Mix well.",
      "Spread dosa batter on a hot tawa in circular motion.",
      "Drizzle oil and cook until crispy golden.",
      "Place potato filling in center, fold and serve with chutney and sambar."
    ],
    likeCount: 15,
    likedBy: [],
    comments: []
  },
  {
    title: "Egg Curry",
    type: "Non-Veg",
    cuisine: "Indian",
    calories: 300,
    protein: 22,
    cookingTime: 30,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
    ingredients: [
      { name: "Egg", quantity: 6, unit: "pieces", price: 42 },
      { name: "Onion", quantity: 2, unit: "pieces", price: 15 },
      { name: "Tomato", quantity: 3, unit: "pieces", price: 15 },
      { name: "Ginger Garlic Paste", quantity: 1, unit: "tbsp", price: 10 },
      { name: "Red Chili Powder", quantity: 1, unit: "tsp", price: 5 },
      { name: "Turmeric", quantity: 1, unit: "tsp", price: 3 },
      { name: "Oil", quantity: 3, unit: "tbsp", price: 15 }
    ],
    directions: [
      "Boil eggs, peel and make small slits on them.",
      "Heat oil, sauté onions until golden brown.",
      "Add ginger garlic paste and cook for a minute.",
      "Add tomatoes, turmeric, chili powder, and salt. Cook until soft.",
      "Add water and bring to a boil to make gravy.",
      "Add boiled eggs and simmer for 10 minutes.",
      "Garnish with coriander and serve with rice or roti."
    ],
    likeCount: 9,
    likedBy: [],
    comments: []
  },
  {
    title: "Vegan Buddha Bowl",
    type: "Vegan",
    cuisine: "Continental",
    calories: 380,
    protein: 14,
    cookingTime: 25,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    ingredients: [
      { name: "Quinoa", quantity: 1, unit: "cup", price: 80 },
      { name: "Chickpeas", quantity: 1, unit: "cup", price: 30 },
      { name: "Avocado", quantity: 1, unit: "piece", price: 60 },
      { name: "Sweet Potato", quantity: 1, unit: "piece", price: 20 },
      { name: "Spinach", quantity: 2, unit: "cups", price: 15 },
      { name: "Tahini", quantity: 2, unit: "tbsp", price: 30 },
      { name: "Lemon", quantity: 1, unit: "piece", price: 5 }
    ],
    directions: [
      "Cook quinoa according to package instructions.",
      "Roast cubed sweet potato at 200°C for 20 minutes.",
      "Drain and rinse chickpeas, season with paprika and roast for 15 min.",
      "Prepare tahini dressing: mix tahini, lemon juice, water, and salt.",
      "Arrange quinoa, roasted sweet potato, chickpeas, sliced avocado, and spinach in a bowl.",
      "Drizzle tahini dressing on top and serve."
    ],
    likeCount: 11,
    likedBy: [],
    comments: []
  },
  {
    title: "Aloo Gobi",
    type: "Veg",
    cuisine: "Indian",
    calories: 200,
    protein: 5,
    cookingTime: 30,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    ingredients: [
      { name: "Potato", quantity: 3, unit: "pieces", price: 20 },
      { name: "Cauliflower", quantity: 1, unit: "head", price: 30 },
      { name: "Onion", quantity: 2, unit: "pieces", price: 15 },
      { name: "Tomato", quantity: 2, unit: "pieces", price: 10 },
      { name: "Turmeric", quantity: 1, unit: "tsp", price: 3 },
      { name: "Cumin Seeds", quantity: 1, unit: "tsp", price: 3 },
      { name: "Oil", quantity: 2, unit: "tbsp", price: 10 }
    ],
    directions: [
      "Cut potato and cauliflower into medium-sized florets.",
      "Heat oil, add cumin seeds and let them splutter.",
      "Add onions and sauté until golden.",
      "Add tomatoes, turmeric, chili powder, and salt. Cook for 5 minutes.",
      "Add potato and cauliflower, mix well.",
      "Cover and cook on low heat for 15-20 minutes until tender.",
      "Garnish with coriander and serve with roti."
    ],
    likeCount: 7,
    likedBy: [],
    comments: []
  },
  {
    title: "Chicken Tikka",
    type: "Non-Veg",
    cuisine: "Indian",
    calories: 320,
    protein: 35,
    cookingTime: 40,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
    ingredients: [
      { name: "Chicken", quantity: 500, unit: "grams", price: 200 },
      { name: "Yogurt", quantity: 1, unit: "cup", price: 25 },
      { name: "Lemon", quantity: 1, unit: "piece", price: 5 },
      { name: "Red Chili Powder", quantity: 2, unit: "tsp", price: 5 },
      { name: "Garam Masala", quantity: 1, unit: "tsp", price: 5 },
      { name: "Ginger Garlic Paste", quantity: 2, unit: "tbsp", price: 10 },
      { name: "Oil", quantity: 2, unit: "tbsp", price: 10 }
    ],
    directions: [
      "Cut chicken into tikka-sized pieces.",
      "Mix yogurt, lemon juice, ginger garlic paste, chili powder, garam masala, and salt.",
      "Marinate chicken in the mixture for at least 2 hours (overnight is best).",
      "Thread chicken onto skewers.",
      "Grill or bake at 220°C for 20-25 minutes, turning once.",
      "Baste with oil or butter while cooking.",
      "Serve hot with mint chutney and onion rings."
    ],
    likeCount: 20,
    likedBy: [],
    comments: []
  },
  {
    title: "Palak Paneer",
    type: "Veg",
    cuisine: "Indian",
    calories: 280,
    protein: 16,
    cookingTime: 30,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
    ingredients: [
      { name: "Spinach", quantity: 500, unit: "grams", price: 25 },
      { name: "Paneer", quantity: 200, unit: "grams", price: 70 },
      { name: "Onion", quantity: 1, unit: "piece", price: 8 },
      { name: "Garlic", quantity: 4, unit: "cloves", price: 5 },
      { name: "Green Chili", quantity: 2, unit: "pieces", price: 2 },
      { name: "Cream", quantity: 2, unit: "tbsp", price: 15 },
      { name: "Cumin Seeds", quantity: 1, unit: "tsp", price: 3 }
    ],
    directions: [
      "Blanch spinach in boiling water for 2 minutes, then transfer to ice water.",
      "Blend blanched spinach into a smooth puree.",
      "Heat oil, add cumin seeds, chopped onion, and garlic. Sauté until soft.",
      "Add spinach puree, green chili, and salt. Cook for 5 minutes.",
      "Add paneer cubes and simmer for 5 minutes.",
      "Finish with a drizzle of cream.",
      "Serve hot with naan or rice."
    ],
    likeCount: 14,
    likedBy: [],
    comments: []
  },
  {
    title: "Vegetable Pasta",
    type: "Veg",
    cuisine: "Italian",
    calories: 350,
    protein: 12,
    cookingTime: 20,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
    ingredients: [
      { name: "Pasta", quantity: 250, unit: "grams", price: 50 },
      { name: "Capsicum", quantity: 1, unit: "piece", price: 15 },
      { name: "Mushroom", quantity: 100, unit: "grams", price: 40 },
      { name: "Tomato", quantity: 3, unit: "pieces", price: 15 },
      { name: "Garlic", quantity: 4, unit: "cloves", price: 5 },
      { name: "Olive Oil", quantity: 2, unit: "tbsp", price: 25 },
      { name: "Basil", quantity: 5, unit: "leaves", price: 10 }
    ],
    directions: [
      "Boil pasta in salted water until al dente. Drain and set aside.",
      "Heat olive oil, sauté minced garlic until fragrant.",
      "Add sliced mushrooms and capsicum, cook for 3 minutes.",
      "Add chopped tomatoes and cook until they break down into a sauce.",
      "Season with salt, pepper, and Italian herbs.",
      "Toss in cooked pasta and mix well.",
      "Garnish with fresh basil leaves and serve."
    ],
    likeCount: 10,
    likedBy: [],
    comments: []
  },
  {
    title: "Dal Tadka",
    type: "Veg",
    cuisine: "Indian",
    calories: 180,
    protein: 12,
    cookingTime: 25,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800",
    ingredients: [
      { name: "Toor Dal", quantity: 1, unit: "cup", price: 30 },
      { name: "Onion", quantity: 1, unit: "piece", price: 8 },
      { name: "Tomato", quantity: 2, unit: "pieces", price: 10 },
      { name: "Ghee", quantity: 2, unit: "tbsp", price: 25 },
      { name: "Cumin Seeds", quantity: 1, unit: "tsp", price: 3 },
      { name: "Turmeric", quantity: 1, unit: "tsp", price: 3 },
      { name: "Red Chili", quantity: 2, unit: "pieces", price: 2 }
    ],
    directions: [
      "Wash and pressure cook dal with turmeric and water for 3-4 whistles.",
      "Mash the cooked dal and keep it simmering on low heat.",
      "In a separate pan, heat ghee for tadka.",
      "Add cumin seeds, dried red chilies, and chopped onions.",
      "When onions turn golden, add tomatoes and cook until soft.",
      "Pour the tadka over the simmering dal.",
      "Garnish with coriander and serve with rice or roti."
    ],
    likeCount: 13,
    likedBy: [],
    comments: []
  },
  {
    title: "Fish Curry",
    type: "Non-Veg",
    cuisine: "South Indian",
    calories: 280,
    protein: 28,
    cookingTime: 35,
    image: "https://images.unsplash.com/photo-1626508035297-0cd84c457d10?w=800",
    ingredients: [
      { name: "Fish", quantity: 500, unit: "grams", price: 250 },
      { name: "Coconut Milk", quantity: 1, unit: "cup", price: 40 },
      { name: "Onion", quantity: 2, unit: "pieces", price: 15 },
      { name: "Tomato", quantity: 2, unit: "pieces", price: 10 },
      { name: "Turmeric", quantity: 1, unit: "tsp", price: 3 },
      { name: "Red Chili Powder", quantity: 2, unit: "tsp", price: 5 },
      { name: "Curry Leaves", quantity: 10, unit: "leaves", price: 2 }
    ],
    directions: [
      "Clean fish, apply turmeric and salt, set aside for 10 minutes.",
      "Heat oil, add curry leaves, sliced onions, and sauté until golden.",
      "Add tomatoes, turmeric, chili powder, and cook until soft.",
      "Add water and bring to a boil.",
      "Gently add fish pieces and cook on medium heat for 10 minutes.",
      "Pour coconut milk and simmer for 5 minutes. Do not boil vigorously.",
      "Serve hot with steamed rice."
    ],
    likeCount: 11,
    likedBy: [],
    comments: []
  },
  {
    title: "Chole Bhature",
    type: "Veg",
    cuisine: "North Indian",
    calories: 450,
    protein: 15,
    cookingTime: 45,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800",
    ingredients: [
      { name: "Chickpeas", quantity: 2, unit: "cups", price: 50 },
      { name: "Onion", quantity: 2, unit: "pieces", price: 15 },
      { name: "Tomato", quantity: 3, unit: "pieces", price: 15 },
      { name: "Flour", quantity: 2, unit: "cups", price: 20 },
      { name: "Yogurt", quantity: 2, unit: "tbsp", price: 10 },
      { name: "Chole Masala", quantity: 2, unit: "tbsp", price: 15 },
      { name: "Oil", quantity: 500, unit: "ml", price: 60 }
    ],
    directions: [
      "Soak chickpeas overnight and pressure cook until soft.",
      "Sauté onions until brown, add ginger garlic paste.",
      "Add tomatoes and cook until mushy.",
      "Add chole masala, salt, and cooked chickpeas with water.",
      "Simmer for 20 minutes until gravy thickens.",
      "For bhature: knead flour with yogurt, salt, and oil. Rest for 1 hour.",
      "Roll into circles and deep fry until puffed and golden.",
      "Serve chole with bhature, onion rings, and pickle."
    ],
    likeCount: 16,
    likedBy: [],
    comments: []
  },
  {
    title: "Mushroom Stir Fry",
    type: "Vegan",
    cuisine: "Asian",
    calories: 150,
    protein: 8,
    cookingTime: 15,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    ingredients: [
      { name: "Mushroom", quantity: 300, unit: "grams", price: 60 },
      { name: "Capsicum", quantity: 1, unit: "piece", price: 15 },
      { name: "Soy Sauce", quantity: 2, unit: "tbsp", price: 10 },
      { name: "Garlic", quantity: 3, unit: "cloves", price: 3 },
      { name: "Sesame Oil", quantity: 1, unit: "tbsp", price: 15 },
      { name: "Spring Onion", quantity: 3, unit: "stalks", price: 10 }
    ],
    directions: [
      "Clean and slice mushrooms.",
      "Heat sesame oil in a wok on high heat.",
      "Add minced garlic and stir-fry for 30 seconds.",
      "Add mushrooms and capsicum, stir-fry for 3-4 minutes.",
      "Add soy sauce, pepper, and toss well.",
      "Garnish with spring onions and serve immediately."
    ],
    likeCount: 6,
    likedBy: [],
    comments: []
  },
  {
    title: "Rajma Chawal",
    type: "Veg",
    cuisine: "North Indian",
    calories: 380,
    protein: 14,
    cookingTime: 50,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    ingredients: [
      { name: "Kidney Beans", quantity: 2, unit: "cups", price: 60 },
      { name: "Onion", quantity: 2, unit: "pieces", price: 15 },
      { name: "Tomato", quantity: 3, unit: "pieces", price: 15 },
      { name: "Rice", quantity: 2, unit: "cups", price: 40 },
      { name: "Ginger Garlic Paste", quantity: 1, unit: "tbsp", price: 10 },
      { name: "Garam Masala", quantity: 1, unit: "tsp", price: 5 },
      { name: "Oil", quantity: 2, unit: "tbsp", price: 10 }
    ],
    directions: [
      "Soak rajma overnight and pressure cook for 5-6 whistles.",
      "Heat oil, sauté onions until golden brown.",
      "Add ginger garlic paste and cook for a minute.",
      "Add tomato puree, salt, chili powder, and cook until oil separates.",
      "Add cooked rajma with its water. Simmer for 20 minutes.",
      "Add garam masala and mash some beans for thicker gravy.",
      "Cook rice separately and serve rajma over hot steamed rice."
    ],
    likeCount: 17,
    likedBy: [],
    comments: []
  },
  {
    title: "Vegan Tacos",
    type: "Vegan",
    cuisine: "Mexican",
    calories: 250,
    protein: 10,
    cookingTime: 20,
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
    ingredients: [
      { name: "Tortilla", quantity: 6, unit: "pieces", price: 50 },
      { name: "Black Beans", quantity: 1, unit: "cup", price: 30 },
      { name: "Avocado", quantity: 1, unit: "piece", price: 60 },
      { name: "Tomato", quantity: 2, unit: "pieces", price: 10 },
      { name: "Onion", quantity: 1, unit: "piece", price: 8 },
      { name: "Lemon", quantity: 1, unit: "piece", price: 5 },
      { name: "Cumin", quantity: 1, unit: "tsp", price: 3 }
    ],
    directions: [
      "Cook black beans with cumin, salt, and a splash of water.",
      "Dice tomatoes, onion, and avocado for fresh salsa.",
      "Mix salsa ingredients with lemon juice and salt.",
      "Warm tortillas on a dry pan for 30 seconds each side.",
      "Fill each tortilla with seasoned black beans.",
      "Top with fresh salsa and sliced avocado.",
      "Squeeze lemon on top and serve immediately."
    ],
    likeCount: 9,
    likedBy: [],
    comments: []
  },
  {
    title: "Maggi Noodles",
    type: "Veg",
    cuisine: "Indian",
    calories: 320,
    protein: 8,
    cookingTime: 10,
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800",
    ingredients: [
      { name: "Maggi Noodles", quantity: 2, unit: "packs", price: 28 },
      { name: "Onion", quantity: 1, unit: "piece", price: 8 },
      { name: "Tomato", quantity: 1, unit: "piece", price: 5 },
      { name: "Capsicum", quantity: 1, unit: "piece", price: 15 },
      { name: "Oil", quantity: 1, unit: "tbsp", price: 5 }
    ],
    directions: [
      "Boil 2 cups of water in a pan.",
      "Add noodles and masala packet, cook for 2 minutes.",
      "Meanwhile, chop onion, tomato, and capsicum.",
      "In a separate pan, sauté vegetables in oil for 2 minutes.",
      "Add the half-cooked noodles to the vegetables.",
      "Toss well and cook until water is absorbed.",
      "Serve hot."
    ],
    likeCount: 22,
    likedBy: [],
    comments: []
  },
  {
    title: "Butter Chicken",
    type: "Non-Veg",
    cuisine: "North Indian",
    calories: 490,
    protein: 32,
    cookingTime: 45,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
    ingredients: [
      { name: "Chicken", quantity: 500, unit: "grams", price: 200 },
      { name: "Butter", quantity: 4, unit: "tbsp", price: 40 },
      { name: "Tomato", quantity: 5, unit: "pieces", price: 25 },
      { name: "Cream", quantity: 100, unit: "ml", price: 40 },
      { name: "Yogurt", quantity: 1, unit: "cup", price: 25 },
      { name: "Ginger Garlic Paste", quantity: 2, unit: "tbsp", price: 10 },
      { name: "Kasuri Methi", quantity: 1, unit: "tbsp", price: 5 }
    ],
    directions: [
      "Marinate chicken with yogurt, lemon, chili powder, and salt for 2 hours.",
      "Grill or pan-fry marinated chicken until charred. Set aside.",
      "Blanch tomatoes, blend into puree.",
      "Melt butter, add ginger garlic paste, then tomato puree.",
      "Cook on medium heat for 15 minutes until thick.",
      "Add cream, kasuri methi, sugar, and garam masala.",
      "Add grilled chicken and simmer for 10 minutes.",
      "Finish with a swirl of cream and serve with naan."
    ],
    likeCount: 25,
    likedBy: [],
    comments: []
  },
  {
    title: "Idli Sambar",
    type: "Veg",
    cuisine: "South Indian",
    calories: 180,
    protein: 8,
    cookingTime: 15,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
    ingredients: [
      { name: "Idli Batter", quantity: 2, unit: "cups", price: 40 },
      { name: "Toor Dal", quantity: 1, unit: "cup", price: 30 },
      { name: "Carrot", quantity: 1, unit: "piece", price: 10 },
      { name: "Drumstick", quantity: 1, unit: "piece", price: 10 },
      { name: "Sambar Powder", quantity: 2, unit: "tbsp", price: 10 },
      { name: "Tamarind", quantity: 1, unit: "tbsp", price: 5 },
      { name: "Mustard Seeds", quantity: 1, unit: "tsp", price: 3 }
    ],
    directions: [
      "Pour idli batter into greased idli molds.",
      "Steam for 10-12 minutes until a toothpick comes out clean.",
      "For sambar: Cook toor dal until soft. Mash and keep aside.",
      "Boil vegetables with tamarind water and sambar powder.",
      "Add cooked dal and simmer for 10 minutes.",
      "Prepare tadka with mustard seeds, curry leaves, and dried chilies.",
      "Pour tadka over sambar. Serve idlis with hot sambar and chutney."
    ],
    likeCount: 13,
    likedBy: [],
    comments: []
  },
  {
    title: "Smoothie Bowl",
    type: "Vegan",
    cuisine: "Dessert",
    calories: 220,
    protein: 6,
    cookingTime: 5,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
    ingredients: [
      { name: "Banana", quantity: 2, unit: "pieces", price: 10 },
      { name: "Blueberries", quantity: 100, unit: "grams", price: 80 },
      { name: "Almond Milk", quantity: 1, unit: "cup", price: 40 },
      { name: "Granola", quantity: 50, unit: "grams", price: 30 },
      { name: "Honey", quantity: 1, unit: "tbsp", price: 15 },
      { name: "Chia Seeds", quantity: 1, unit: "tbsp", price: 20 }
    ],
    directions: [
      "Freeze bananas for at least 2 hours.",
      "Blend frozen bananas, half the blueberries, and almond milk until thick and smooth.",
      "Pour into a bowl — it should be thicker than a regular smoothie.",
      "Top with granola, remaining blueberries, and chia seeds.",
      "Drizzle honey on top.",
      "Serve immediately and enjoy!"
    ],
    likeCount: 8,
    likedBy: [],
    comments: []
  }
];

// Send recipes one by one to the backend
async function seedRecipes() {
  console.log("Seeding 20 recipes to http://localhost:8081/recipes ...\n");

  let success = 0;
  let failed = 0;

  for (const recipe of recipes) {
    try {
      const data = JSON.stringify(recipe);
      const result = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 8081,
          path: '/recipes',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
          },
          timeout: 30000
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve({ status: res.statusCode, body }));
        });

        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        req.write(data);
        req.end();
      });

      if (result.status === 200 || result.status === 201) {
        console.log(`  ✅ ${recipe.title} (${recipe.type} - ${recipe.cuisine})`);
        success++;
      } else {
        console.log(`  ❌ ${recipe.title} - HTTP ${result.status}`);
        failed++;
      }
    } catch (err) {
      console.log(`  ❌ ${recipe.title} - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n🎉 Done! ${success} recipes added, ${failed} failed.`);
  console.log("Refresh your browser at http://localhost:5173 to see them!");
}

seedRecipes();
