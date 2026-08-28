/**
 * SmartCart AI - Master Dataset
 * High-quality grocery catalog, chef recipes, and promotional discounts
 */

export const INITIAL_PRODUCTS = [
  // --- PRODUCE ---
  {
    id: "prod-01",
    name: "Organic Hass Avocados",
    category: "produce",
    price: 4.99,
    unit: "pack of 4",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 128,
    stock: 24,
    dietary: ["organic", "vegan", "keto", "gluten_free"],
    nutrition: { calories: 320, protein: 4, carbs: 17, fat: 29, fiber: 13 },
    description: "Creamy, ripe Hass avocados grown organically in Michoacán. Perfect for keto salads and guacamole."
  },
  {
    id: "prod-02",
    name: "Fresh Organic Baby Spinach",
    category: "produce",
    price: 3.49,
    unit: "16 oz tub",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 94,
    stock: 35,
    dietary: ["organic", "vegan", "keto", "gluten_free", "high_protein"],
    nutrition: { calories: 45, protein: 5, carbs: 7, fat: 1, fiber: 4 },
    description: "Triple-washed tender organic baby spinach leaves packed with iron and antioxidants."
  },
  {
    id: "prod-03",
    name: "Heirloom Cherry Tomatoes",
    category: "produce",
    price: 3.99,
    unit: "1 pint",
    image: "https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 62,
    stock: 18,
    dietary: ["organic", "vegan", "keto", "gluten_free"],
    nutrition: { calories: 35, protein: 2, carbs: 7, fat: 0, fiber: 2 },
    description: "Sweet, multi-colored heirloom medley bursting with garden-fresh flavor."
  },
  {
    id: "prod-04",
    name: "Fresh Sweet Blueberries",
    category: "produce",
    price: 4.49,
    unit: "1 pint",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 156,
    stock: 22,
    dietary: ["organic", "vegan", "gluten_free"],
    nutrition: { calories: 84, protein: 1, carbs: 21, fat: 0.5, fiber: 3.6 },
    description: "Plump, antioxidant-rich organic blueberries harvested at peak ripeness."
  },
  {
    id: "prod-05",
    name: "Crisp English Cucumber",
    category: "produce",
    price: 1.79,
    unit: "each",
    image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviews: 43,
    stock: 40,
    dietary: ["organic", "vegan", "keto", "gluten_free"],
    nutrition: { calories: 16, protein: 1, carbs: 4, fat: 0.2, fiber: 1 },
    description: "Seedless, refreshing cucumber with a thin edible skin."
  },
  {
    id: "prod-06",
    name: "Fresh Garlic Bulbs",
    category: "produce",
    price: 1.49,
    unit: "3 count pack",
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 88,
    stock: 50,
    dietary: ["organic", "vegan", "keto", "gluten_free"],
    nutrition: { calories: 20, protein: 1, carbs: 4, fat: 0, fiber: 0.5 },
    description: "Aromatic organic white garlic cloves, essential for savory culinary creations."
  },

  // --- PROTEIN & SEAFOOD ---
  {
    id: "prod-07",
    name: "Wild Atlantic Salmon Fillet",
    category: "protein",
    price: 12.99,
    unit: "1 lb (approx)",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 210,
    stock: 15,
    dietary: ["keto", "gluten_free", "high_protein"],
    nutrition: { calories: 410, protein: 46, carbs: 0, fat: 24, fiber: 0 },
    description: "Sustainably caught wild salmon rich in Omega-3 fatty acids and lean protein."
  },
  {
    id: "prod-08",
    name: "Organic Boneless Chicken Breast",
    category: "protein",
    price: 8.99,
    unit: "1.25 lb pack",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 185,
    stock: 20,
    dietary: ["organic", "keto", "gluten_free", "high_protein"],
    nutrition: { calories: 360, protein: 68, carbs: 0, fat: 7, fiber: 0 },
    description: "Free-range, air-chilled organic chicken breasts without antibiotics or added hormones."
  },
  {
    id: "prod-09",
    name: "Organic Extra Firm Tofu",
    category: "protein",
    price: 2.99,
    unit: "14 oz block",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 78,
    stock: 30,
    dietary: ["organic", "vegan", "keto", "gluten_free", "high_protein"],
    nutrition: { calories: 180, protein: 20, carbs: 4, fat: 10, fiber: 2 },
    description: "Non-GMO sprouted organic tofu, high in plant protein and perfect for stir-fries."
  },
  {
    id: "prod-10",
    name: "Pasture-Raised Grade A Large Eggs",
    category: "protein",
    price: 5.49,
    unit: "1 dozen",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80",
    rating: 5.0,
    reviews: 320,
    stock: 28,
    dietary: ["organic", "keto", "gluten_free", "high_protein"],
    nutrition: { calories: 280, protein: 24, carbs: 2, fat: 20, fiber: 0 },
    description: "Rich golden yolks from hens with 108+ sq ft of outdoor pasture per bird."
  },
  {
    id: "prod-11",
    name: "Grass-Fed Lean Ground Beef (90/10)",
    category: "protein",
    price: 9.49,
    unit: "1 lb pack",
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 112,
    stock: 14,
    dietary: ["organic", "keto", "gluten_free", "high_protein"],
    nutrition: { calories: 440, protein: 48, carbs: 0, fat: 26, fiber: 0 },
    description: "100% grass-fed and grass-finished ground beef for healthy burgers and tacos."
  },

  // --- DAIRY & PLANT ALTERNATIVES ---
  {
    id: "prod-12",
    name: "Organic Unsweetened Almond Milk",
    category: "dairy",
    price: 3.79,
    unit: "64 fl oz carton",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 140,
    stock: 25,
    dietary: ["organic", "vegan", "keto", "gluten_free"],
    nutrition: { calories: 60, protein: 2, carbs: 2, fat: 5, fiber: 2 },
    description: "Smooth plant-based milk made with organic California almonds. Zero added sugars."
  },
  {
    id: "prod-13",
    name: "Greek Whole Milk Plain Yogurt",
    category: "dairy",
    price: 4.29,
    unit: "32 oz tub",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 195,
    stock: 20,
    dietary: ["organic", "keto", "gluten_free", "high_protein"],
    nutrition: { calories: 260, protein: 28, carbs: 10, fat: 12, fiber: 0 },
    description: "Thick, probiotic-rich authentic strained Greek yogurt with 28g protein per cup."
  },
  {
    id: "prod-14",
    name: "Aged Parmigiano Reggiano Wedge",
    category: "dairy",
    price: 6.99,
    unit: "7 oz wedge",
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=400&q=80",
    rating: 5.0,
    reviews: 88,
    stock: 16,
    dietary: ["keto", "gluten_free", "high_protein"],
    nutrition: { calories: 310, protein: 26, carbs: 0, fat: 22, fiber: 0 },
    description: "DOP certified 24-month aged Italian parmesan cheese with crystals of umami flavor."
  },
  {
    id: "prod-15",
    name: "Organic Oat Milk Barista Edition",
    category: "dairy",
    price: 4.49,
    unit: "32 fl oz",
    image: "https://images.unsplash.com/photo-1568651316492-75d3f27fae7a?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 99,
    stock: 19,
    dietary: ["organic", "vegan"],
    nutrition: { calories: 140, protein: 3, carbs: 16, fat: 7, fiber: 2 },
    description: "Creamy foamable oat milk formulated specifically for specialty coffees and matchas."
  },

  // --- PANTRY & GRAINS ---
  {
    id: "prod-16",
    name: "Gluten-Free Brown Rice Penne Pasta",
    category: "pantry",
    price: 3.89,
    unit: "12 oz box",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 110,
    stock: 32,
    dietary: ["organic", "vegan", "gluten_free"],
    nutrition: { calories: 200, protein: 4, carbs: 44, fat: 1, fiber: 2 },
    description: "Artisan Italian gluten-free pasta with al dente texture made from 100% whole grain brown rice."
  },
  {
    id: "prod-17",
    name: "Organic Extra Virgin Olive Oil",
    category: "pantry",
    price: 11.49,
    unit: "500 ml bottle",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 172,
    stock: 22,
    dietary: ["organic", "vegan", "keto", "gluten_free"],
    nutrition: { calories: 240, protein: 0, carbs: 0, fat: 28, fiber: 0 },
    description: "First cold-pressed unrefined Greek Koroneiki extra virgin olive oil."
  },
  {
    id: "prod-18",
    name: "Organic Basil & Pine Nut Pesto",
    category: "pantry",
    price: 5.49,
    unit: "6.5 oz jar",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 67,
    stock: 18,
    dietary: ["keto", "gluten_free", "organic"],
    nutrition: { calories: 230, protein: 4, carbs: 3, fat: 23, fiber: 1 },
    description: "Classic Genoese pesto made with fresh Genovese basil, pine nuts, garlic, and pecorino."
  },
  {
    id: "prod-19",
    name: "Organic Tri-Color Quinoa",
    category: "pantry",
    price: 4.79,
    unit: "16 oz pouch",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 84,
    stock: 26,
    dietary: ["organic", "vegan", "gluten_free", "high_protein"],
    nutrition: { calories: 170, protein: 6, carbs: 30, fat: 2.5, fiber: 4 },
    description: "Nutty, complete plant protein grain mix from Andean highlands."
  },
  {
    id: "prod-20",
    name: "Organic Black Beans (Low Sodium)",
    category: "pantry",
    price: 1.69,
    unit: "15 oz can",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
    reviews: 55,
    stock: 45,
    dietary: ["organic", "vegan", "gluten_free", "high_protein"],
    nutrition: { calories: 110, protein: 7, carbs: 20, fat: 0.5, fiber: 6 },
    description: "Tender, simmered black beans ready for burritos, bowls, and high-fiber soups."
  },
  {
    id: "prod-21",
    name: "Almond Flour (Superfine Blanched)",
    category: "pantry",
    price: 7.99,
    unit: "16 oz bag",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 130,
    stock: 17,
    dietary: ["organic", "vegan", "keto", "gluten_free", "high_protein"],
    nutrition: { calories: 160, protein: 6, carbs: 6, fat: 14, fiber: 3 },
    description: "Low-carb keto flour substitute made from 100% skinless blanched almonds."
  },

  // --- BAKERY ---
  {
    id: "prod-22",
    name: "Artisan Sourdough Boule",
    category: "bakery",
    price: 4.99,
    unit: "1 loaf (18 oz)",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 240,
    stock: 12,
    dietary: ["vegan", "organic"],
    nutrition: { calories: 180, protein: 6, carbs: 36, fat: 1, fiber: 2 },
    description: "Naturally fermented 36-hour sourdough with a blistered crunchy crust and airy crumb."
  },
  {
    id: "prod-23",
    name: "Gluten-Free Multi-Seed Bread",
    category: "bakery",
    price: 5.99,
    unit: "1 loaf (14 oz)",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
    reviews: 73,
    stock: 15,
    dietary: ["gluten_free", "vegan"],
    nutrition: { calories: 150, protein: 4, carbs: 24, fat: 4.5, fiber: 4 },
    description: "Hearty gluten-free sliced bread loaded with chia, flax, pumpkin, and sesame seeds."
  },

  // --- SNACKS & BEVERAGES ---
  {
    id: "prod-24",
    name: "Raw Organic Chia Seeds",
    category: "snacks",
    price: 4.29,
    unit: "12 oz pouch",
    image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 89,
    stock: 25,
    dietary: ["organic", "vegan", "keto", "gluten_free", "high_protein"],
    nutrition: { calories: 140, protein: 5, carbs: 12, fat: 9, fiber: 10 },
    description: "Superfood chia seeds loaded with Omega-3 and soluble dietary fiber for puddings and smoothies."
  },
  {
    id: "prod-25",
    name: "Organic Sparkling Mineral Water",
    category: "beverages",
    price: 5.99,
    unit: "8-pack (12 oz cans)",
    image: "https://images.unsplash.com/photo-1559839914-ba2c62c21961?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    reviews: 142,
    stock: 30,
    dietary: ["organic", "vegan", "keto", "gluten_free"],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    description: "Crisp natural mountain mineral water with fine sparkling bubbles and zero calories."
  },
  {
    id: "prod-26",
    name: "Cold-Pressed Ginger Turmeric Wellness Shot",
    category: "beverages",
    price: 3.29,
    unit: "2 fl oz bottle",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
    reviews: 95,
    stock: 22,
    dietary: ["organic", "vegan", "keto", "gluten_free"],
    nutrition: { calories: 25, protein: 0.5, carbs: 6, fat: 0, fiber: 0.5 },
    description: "Potent immunity booster with fresh ginger root, Peruvian turmeric, black pepper, and lemon."
  }
];

export const CHEF_RECIPES = [
  {
    id: "recipe-01",
    name: "Gluten-Free Tuscan Pesto Penne",
    cuisine: "Italian",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: 4,
    estimatedCost: 20.36,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80",
    dietary: ["gluten_free", "vegetarian"],
    description: "A quick, gourmet Mediterranean dinner featuring al dente brown rice penne tossed in rich basil pesto, aged parmesan, and sweet cherry tomatoes.",
    nutritionPerServing: { calories: 420, protein: 14, carbs: 52, fat: 18 },
    ingredients: [
      { productId: "prod-16", quantity: 1, notes: "Gluten-Free Brown Rice Penne" },
      { productId: "prod-18", quantity: 1, notes: "Organic Basil & Pine Nut Pesto" },
      { productId: "prod-03", quantity: 1, notes: "Heirloom Cherry Tomatoes" },
      { productId: "prod-14", quantity: 1, notes: "Aged Parmigiano Reggiano Wedge" }
    ]
  },
  {
    id: "recipe-02",
    name: "Keto Wild Salmon & Avocado Power Bowl",
    cuisine: "Californian / Nordic",
    prepTime: "15 min",
    difficulty: "Easy",
    servings: 2,
    estimatedCost: 32.96,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    dietary: ["keto", "gluten_free", "high_protein"],
    description: "Pan-seared wild Atlantic salmon served over a crisp bed of baby spinach, Hass avocados, and extra virgin olive oil drizzle.",
    nutritionPerServing: { calories: 580, protein: 48, carbs: 12, fat: 38 },
    ingredients: [
      { productId: "prod-07", quantity: 1, notes: "Wild Atlantic Salmon Fillet" },
      { productId: "prod-01", quantity: 1, notes: "Organic Hass Avocados" },
      { productId: "prod-02", quantity: 1, notes: "Fresh Baby Spinach" },
      { productId: "prod-17", quantity: 1, notes: "Extra Virgin Olive Oil" }
    ]
  },
  {
    id: "recipe-03",
    name: "High-Protein Garlic Herb Chicken & Quinoa",
    cuisine: "Mediterranean",
    prepTime: "25 min",
    difficulty: "Medium",
    servings: 4,
    estimatedCost: 17.06,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80",
    dietary: ["organic", "gluten_free", "high_protein"],
    description: "Seared antibiotic-free organic chicken breast with garlic herb glaze over fluffy tri-color quinoa and fresh English cucumber.",
    nutritionPerServing: { calories: 460, protein: 44, carbs: 32, fat: 14 },
    ingredients: [
      { productId: "prod-08", quantity: 1, notes: "Organic Boneless Chicken Breast" },
      { productId: "prod-19", quantity: 1, notes: "Organic Tri-Color Quinoa" },
      { productId: "prod-06", quantity: 1, notes: "Fresh Garlic Bulbs" },
      { productId: "prod-05", quantity: 1, notes: "Crisp English Cucumber" }
    ]
  },
  {
    id: "recipe-04",
    name: "Vegan Superfood Power Bowl",
    cuisine: "Plant-Based",
    prepTime: "20 min",
    difficulty: "Easy",
    servings: 2,
    estimatedCost: 13.16,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
    dietary: ["vegan", "organic", "gluten_free", "high_protein"],
    description: "Crispy pan-fried organic tofu cubes, simmered black beans, ripe avocado, and baby spinach.",
    nutritionPerServing: { calories: 410, protein: 26, carbs: 38, fat: 19 },
    ingredients: [
      { productId: "prod-09", quantity: 1, notes: "Organic Extra Firm Tofu" },
      { productId: "prod-20", quantity: 1, notes: "Organic Black Beans" },
      { productId: "prod-01", quantity: 1, notes: "Organic Hass Avocados" },
      { productId: "prod-02", quantity: 1, notes: "Fresh Baby Spinach" }
    ]
  }
];

export const PROMO_CODES = {
  "WEBMCP20": {
    code: "WEBMCP20",
    discountPercent: 20,
    description: "Official WebMCP Hackathon 20% discount on total cart"
  },
  "HEALTHY10": {
    code: "HEALTHY10",
    discountPercent: 10,
    description: "10% off for healthy & organic grocery baskets"
  },
  "FREESHIP": {
    code: "FREESHIP",
    discountAmount: 5.99,
    description: "Free express delivery credit"
  }
};
