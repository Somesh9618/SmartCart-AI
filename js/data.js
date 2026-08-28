/**
 * SmartCart AI - Fashion & Footwear Master Dataset
 * Curated designer apparel, premium footwear, accessories, and outfit lookbooks
 */

export const INITIAL_PRODUCTS = [
  // --- FOOTWEAR & SNEAKERS ---
  {
    id: "shoe-01",
    name: "Apex CloudRunner Pro Sneakers",
    category: "footwear",
    price: 129.99,
    unit: "pair",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 342,
    stock: 18,
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Crimson Red", "Stealth Black", "Arctic White"],
    styles: ["athletic", "streetwear"],
    material: "Breathable Knit & Responsive Foam",
    description: "Ultra-lightweight performance running shoes featuring responsive foam cushioning and aerodynamic breathable mesh."
  },
  {
    id: "shoe-02",
    name: "Classic Minimalist White Leather Court Sneakers",
    category: "footwear",
    price: 89.99,
    unit: "pair",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 215,
    stock: 25,
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    colors: ["Pure White", "White / Emerald Heel", "White / Navy"],
    styles: ["smart_casual", "streetwear", "sustainable"],
    material: "100% Full-Grain Italian Leather",
    description: "Timeless low-top court sneakers handcrafted with supple full-grain leather and vulcanized rubber sole."
  },
  {
    id: "shoe-03",
    name: "Heritage Chelsea Boots (Handcrafted Leather)",
    category: "footwear",
    price: 149.99,
    unit: "pair",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 180,
    stock: 14,
    sizes: ["US 8", "US 9", "US 10", "US 11"],
    colors: ["Cognac Brown", "Midnight Black", "Suede Tan"],
    styles: ["smart_casual", "formal"],
    material: "Waterproof Waxed Leather",
    description: "Sleek ankle Chelsea boots with elastic side gussets, Goodyear welt construction, and ergonomic cushioned footbed."
  },
  {
    id: "shoe-04",
    name: "TrailGrip All-Weather Hiking Boots",
    category: "footwear",
    price: 139.99,
    unit: "pair",
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 98,
    stock: 16,
    sizes: ["US 9", "US 10", "US 11", "US 12"],
    colors: ["Olive Green", "Charcoal Grey", "Desert Tan"],
    styles: ["outdoor", "athletic"],
    material: "Waterproof Cordura & Vibram Sole",
    description: "Rugged waterproof outdoor boots designed for mountain trails and wet weather grip."
  },

  // --- TOPS, JACKETS & HOODIES ---
  {
    id: "top-01",
    name: "Oversized Heavyweight Fleece Hoodie",
    category: "tops",
    price: 64.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 290,
    stock: 30,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Washed Charcoal", "Forest Green", "Heather Grey", "Sand"],
    styles: ["streetwear", "sustainable"],
    material: "450 GSM Organic Cotton Fleece",
    description: "Relaxed-fit luxury heavyweight hoodie with double-layered hood and ribbed side panels."
  },
  {
    id: "top-02",
    name: "Classic Vintage Denim Trucker Jacket",
    category: "tops",
    price: 79.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 145,
    stock: 22,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Medium Vintage Indigo", "Washed Black", "Light Stonewash"],
    styles: ["streetwear", "smart_casual"],
    material: "100% Rigid Selvedge Denim",
    description: "Iconic denim jacket with vintage brass button hardware, chest flap pockets, and waist adjusters."
  },
  {
    id: "top-03",
    name: "Tailored Linen Button-Down Shirt",
    category: "tops",
    price: 54.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 112,
    stock: 26,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Crisp White", "Sky Blue", "Sage Olive", "Beige"],
    styles: ["smart_casual", "sustainable"],
    material: "100% French Flax Linen",
    description: "Breathable airy linen shirt with a modern tailored cut, perfect for warm evenings and smart-casual layers."
  },
  {
    id: "top-04",
    name: "Organic Crewneck Essential Tee",
    category: "tops",
    price: 24.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 410,
    stock: 60,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Jet Black", "Optic White", "Navy", "Muted Olive"],
    styles: ["sustainable", "streetwear", "smart_casual"],
    material: "100% Combed Organic Cotton",
    description: "Ultra-soft premium cotton t-shirt with reinforced collar and pre-shrunk combed weave."
  },
  {
    id: "top-05",
    name: "Pro-Breathe Seamless Athletic Training Top",
    category: "activewear",
    price: 38.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 135,
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Electric Cyan", "Obsidian Black", "Gunmetal Grey"],
    styles: ["athletic"],
    material: "Moisture-Wicking Antimicrobial Nylon",
    description: "Engineered mesh ventilation zones for high-intensity gym workouts and marathon training."
  },

  // --- PANTS, DENIM & BOTTOMS ---
  {
    id: "bottom-01",
    name: "Slim-Tapered Stretch Chino Trousers",
    category: "bottoms",
    price: 58.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 188,
    stock: 28,
    sizes: ["30x30", "32x32", "34x32", "36x32"],
    colors: ["Khaki Tan", "Midnight Navy", "Olive Green", "Black"],
    styles: ["smart_casual", "formal"],
    material: "97% Cotton, 3% Elastane",
    description: "Versatile stretch chinos tailored for all-day comfort, clean lines, and wrinkle resistance."
  },
  {
    id: "bottom-02",
    name: "Relaxed Fit Cargo Streetwear Pants",
    category: "bottoms",
    price: 68.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 160,
    stock: 20,
    sizes: ["S (30)", "M (32)", "L (34)", "XL (36)"],
    colors: ["Washed Olive", "Tactical Black", "Desert Sand"],
    styles: ["streetwear"],
    material: "Heavy Ripstop Cotton",
    description: "Multi-pocket cargo pants with adjustable bungee ankle cuffs and reinforced knee darts."
  },
  {
    id: "bottom-03",
    name: "High-Rise Sculpt Compression Leggings",
    category: "activewear",
    price: 49.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 375,
    stock: 40,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Espresso Brown", "Matte Black", "Emerald Green"],
    styles: ["athletic", "sustainable"],
    material: "Four-Way Stretch Recycled Spandex",
    description: "Buttery-soft squat-proof compression leggings with hidden waistband phone pocket."
  },
  {
    id: "bottom-04",
    name: "Selvedge Raw Indigo Denim Jeans",
    category: "bottoms",
    price: 89.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 142,
    stock: 19,
    sizes: ["30x32", "32x32", "34x32", "36x34"],
    colors: ["Deep Raw Indigo"],
    styles: ["streetwear", "smart_casual"],
    material: "14oz Japanese Selvedge Cotton",
    description: "Authentic shuttle-loom woven raw selvedge denim that shapes and fades uniquely to your wear."
  },

  // --- ACCESSORIES & WATCHES ---
  {
    id: "acc-01",
    name: "Urban Matte Black Chronograph Watch",
    category: "accessories",
    price: 119.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 120,
    stock: 15,
    sizes: ["One Size (40mm)"],
    colors: ["Matte Black / Black Leather", "Silver / Tan Leather"],
    styles: ["smart_casual", "streetwear"],
    material: "Sapphire Crystal & Japanese Quartz",
    description: "Minimalist stainless steel chronograph watch with scratch-resistant sapphire crystal glass and genuine leather strap."
  },
  {
    id: "acc-02",
    name: "Handmade Italian Leather Dress Belt",
    category: "accessories",
    price: 39.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 95,
    stock: 30,
    sizes: ["32", "34", "36", "38"],
    colors: ["Rich Cognac", "Classic Black"],
    styles: ["smart_casual", "formal"],
    material: "Full-Grain Tuscan Leather",
    description: "Vegetable-tanned leather belt with brushed gunmetal buckle for denim or dress chinos."
  },
  {
    id: "acc-03",
    name: "Polarized Classic Retro Sunglasses",
    category: "accessories",
    price: 45.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 168,
    stock: 25,
    sizes: ["One Size"],
    colors: ["Tortoise Shell / Green Lens", "Gloss Black / Grey Lens"],
    styles: ["streetwear", "smart_casual"],
    material: "Acetate Frame & UV400 Polarized Lenses",
    description: "Hand-polished acetate frame sunglasses providing 100% UVA/UVB eye protection and glare reduction."
  },
  {
    id: "acc-04",
    name: "Water-Resistant Minimalist Commuter Backpack",
    category: "accessories",
    price: 74.99,
    unit: "each",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 210,
    stock: 18,
    sizes: ["20L Capacity"],
    colors: ["Stealth Black", "Slate Grey"],
    styles: ["streetwear", "athletic"],
    material: "Ballistic Matte Nylon",
    description: "Weatherproof 16-inch laptop compartment backpack with ergonomic padded shoulder harness."
  }
];

export const CURATED_OUTFITS = [
  {
    id: "outfit-01",
    name: "Minimalist Urban Streetwear Set",
    style: "Streetwear",
    occasion: "Casual / Weekend",
    piecesCount: 4,
    estimatedCost: 269.96,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    description: "A coordinated streetwear aesthetic featuring our heavyweight fleece hoodie, selvedge raw denim, minimalist white leather court sneakers, and polarized retro sunglasses.",
    items: [
      { productId: "top-01", name: "Heavyweight Fleece Hoodie", defaultSize: "L" },
      { productId: "bottom-04", name: "Selvedge Raw Indigo Jeans", defaultSize: "32x32" },
      { productId: "shoe-02", name: "White Leather Court Sneakers", defaultSize: "US 10" },
      { productId: "acc-03", name: "Polarized Retro Sunglasses", defaultSize: "One Size" }
    ]
  },
  {
    id: "outfit-02",
    name: "Smart Casual Business & Date Night Look",
    style: "Smart Casual",
    occasion: "Evening / Office",
    piecesCount: 4,
    estimatedCost: 303.96,
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80",
    description: "Effortlessly sharp look combining tailored French linen shirt, slim stretch chinos, handcrafted leather Chelsea boots, and Tuscan leather belt.",
    items: [
      { productId: "top-03", name: "Tailored Linen Button-Down", defaultSize: "M" },
      { productId: "bottom-01", name: "Slim-Tapered Stretch Chinos", defaultSize: "32x32" },
      { productId: "shoe-03", name: "Heritage Chelsea Boots", defaultSize: "US 10" },
      { productId: "acc-02", name: "Italian Leather Dress Belt", defaultSize: "34" }
    ]
  },
  {
    id: "outfit-03",
    name: "High-Performance Athletic Running Set",
    style: "Athletic",
    occasion: "Workout / Gym",
    piecesCount: 3,
    estimatedCost: 218.97,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    description: "Engineered for maximum speed and stamina: Pro-Breathe seamless training top, Apex CloudRunner Pro sneakers, and high-rise sculpt compression leggings.",
    items: [
      { productId: "top-05", name: "Pro-Breathe Training Top", defaultSize: "M" },
      { productId: "bottom-03", name: "Sculpt Compression Leggings", defaultSize: "M" },
      { productId: "shoe-01", name: "Apex CloudRunner Pro Sneakers", defaultSize: "US 9" }
    ]
  },
  {
    id: "outfit-04",
    name: "Vintage Denim & Chrono Weekend Kit",
    style: "Streetwear",
    occasion: "Weekend / Travel",
    piecesCount: 4,
    estimatedCost: 288.96,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
    description: "Classic cool: vintage denim trucker jacket over organic crewneck tee, relaxed cargo trousers, and matte black chronograph watch.",
    items: [
      { productId: "top-02", name: "Vintage Denim Trucker Jacket", defaultSize: "L" },
      { productId: "top-04", name: "Organic Crewneck Essential Tee", defaultSize: "L" },
      { productId: "bottom-02", name: "Relaxed Fit Cargo Pants", defaultSize: "M (32)" },
      { productId: "acc-01", name: "Urban Matte Black Chronograph Watch", defaultSize: "One Size" }
    ]
  }
];

export const PROMO_CODES = {
  "FASHION20": {
    code: "FASHION20",
    discountPercent: 20,
    description: "20% off all clothing, shoes, and curated lookbooks"
  },
  "SNEAKER10": {
    code: "SNEAKER10",
    discountPercent: 10,
    description: "10% instant discount on premium footwear"
  },
  "FREESHIP": {
    code: "FREESHIP",
    discountAmount: 9.99,
    description: "Free express courier shipping on orders over $50"
  }
};
