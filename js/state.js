/**
 * SmartCart Fashion AI - State Store with User Wardrobe Memory
 * Dynamic Outfit Combination Engine & Persistent Style History
 */

import { INITIAL_PRODUCTS, BRANDS_LIST, PROMO_CODES } from './data.js';

class FashionStateStore {
  constructor() {
    this.products = [...INITIAL_PRODUCTS];
    this.brandsList = [...BRANDS_LIST];
    this.promoCodes = { ...PROMO_CODES };

    // Shopping Cart State
    this.cart = [];
    this.appliedPromo = null;
    this.budgetLimit = 400.00; // default $400 budget

    // Catalog Filter State
    this.filters = {
      searchQuery: "",
      category: "all", // 'all', 'tops', 'bottoms', 'footwear', 'accessories'
      brand: "all",    // 'all' or brand name
      styles: [],      // ['streetwear', 'smart_casual', 'athletic', 'sustainable', 'formal']
      maxPrice: 300,
      sortBy: "popular" // 'popular', 'price-low', 'price-high', 'rating'
    };

    // User Wardrobe Memory (Loaded from localStorage)
    this.memory = this.loadMemory();

    // Human-in-the-Loop Approval State
    this.pendingApproval = null;
    this.orderHistory = [];

    // WebMCP Execution Stream / Telemetry
    this.mcpLogs = [];

    // Subscribers
    this.listeners = new Set();
  }

  // --- MEMORY PERSISTENCE ---
  loadMemory() {
    try {
      const saved = localStorage.getItem("smartcart_wardrobe_memory");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load wardrobe memory:", e);
    }

    return {
      userId: "user-fashion-01",
      preferredSizes: {
        tops: "L",
        bottoms: "32x32",
        shoes: "US 10",
        accessories: "34"
      },
      favoriteBrands: ["Nike", "Levi's", "Ralph Lauren"],
      preferredStyles: ["smart_casual", "streetwear"],
      pastSelections: [],
      generatedOutfitHistory: []
    };
  }

  saveMemory() {
    try {
      localStorage.setItem("smartcart_wardrobe_memory", JSON.stringify(this.memory));
      this.notify("MEMORY_UPDATED", this.memory);
    } catch (e) {
      console.error("Could not save wardrobe memory:", e);
    }
  }

  updateMemoryPreferences({ sizes, brands, styles }) {
    if (sizes) this.memory.preferredSizes = { ...this.memory.preferredSizes, ...sizes };
    if (brands) this.memory.favoriteBrands = Array.from(new Set([...brands]));
    if (styles) this.memory.preferredStyles = Array.from(new Set([...styles]));
    this.saveMemory();
    return this.memory;
  }

  recordSelection(product) {
    if (!product) return;
    this.memory.pastSelections.unshift({
      productId: product.id,
      brand: product.brand,
      name: product.name,
      category: product.category,
      timestamp: Date.now()
    });
    if (this.memory.pastSelections.length > 30) this.memory.pastSelections.pop();

    // Auto-learn favorite brands
    if (product.brand && !this.memory.favoriteBrands.includes(product.brand)) {
      this.memory.favoriteBrands.push(product.brand);
      if (this.memory.favoriteBrands.length > 5) this.memory.favoriteBrands.shift();
    }

    this.saveMemory();
  }

  clearMemory() {
    this.memory = {
      userId: "user-fashion-01",
      preferredSizes: { tops: "L", bottoms: "32x32", shoes: "US 10", accessories: "34" },
      favoriteBrands: [],
      preferredStyles: ["smart_casual"],
      pastSelections: [],
      generatedOutfitHistory: []
    };
    this.saveMemory();
  }

  // --- DYNAMIC OUTFIT GENERATION (Unique Combinations) ---
  generateDynamicOutfit({ style = "smart_casual", occasion = "General", maxBudget = 400, preferredBrand = null, excludeIds = [] }) {
    const tops = this.products.filter(p => p.category === "tops");
    const bottoms = this.products.filter(p => p.category === "bottoms");
    const shoes = this.products.filter(p => p.category === "footwear");
    const accessories = this.products.filter(p => p.category === "accessories");

    // Helper to score and pick best matching item
    const pickItem = (items, category) => {
      const candidates = items.filter(item => !excludeIds.includes(item.id));
      if (candidates.length === 0) return items[Math.floor(Math.random() * items.length)];

      // Rank by style match, brand preference, rating, and randomness for freshness
      const scored = candidates.map(item => {
        let score = Math.random() * 2; // base entropy for fresh unique picks
        if (item.styles.includes(style)) score += 4;
        if (preferredBrand && item.brand.toLowerCase() === preferredBrand.toLowerCase()) score += 5;
        if (this.memory.favoriteBrands.includes(item.brand)) score += 2;
        score += item.rating;
        return { item, score };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored[0].item;
    };

    const selectedTop = pickItem(tops, "tops");
    const selectedBottom = pickItem(bottoms, "bottoms");
    const selectedShoe = pickItem(shoes, "footwear");
    const selectedAccessory = pickItem(accessories, "accessories");

    const totalCost = Number((selectedTop.price + selectedBottom.price + selectedShoe.price + selectedAccessory.price).toFixed(2));

    // Resolve size from user memory or item defaults
    const topSize = this.memory.preferredSizes.tops || (selectedTop.sizes ? selectedTop.sizes[0] : "L");
    const bottomSize = this.memory.preferredSizes.bottoms || (selectedBottom.sizes ? selectedBottom.sizes[0] : "32x32");
    const shoeSize = this.memory.preferredSizes.shoes || (selectedShoe.sizes ? selectedShoe.sizes[0] : "US 10");
    const accSize = this.memory.preferredSizes.accessories || (selectedAccessory.sizes ? selectedAccessory.sizes[0] : "34");

    const outfit = {
      id: "outfit-dyn-" + Date.now().toString(36),
      title: `${style.replace('_', ' ').toUpperCase()} Lookbook: ${selectedTop.brand} & ${selectedShoe.brand}`,
      style: style,
      occasion: occasion,
      totalCost: totalCost,
      pieces: [
        { product: selectedTop, size: topSize, color: selectedTop.colors[0], role: "Top / Shirt" },
        { product: selectedBottom, size: bottomSize, color: selectedBottom.colors[0], role: "Pants / Jeans" },
        { product: selectedShoe, size: shoeSize, color: selectedShoe.colors[0], role: "Footwear / Shoes" },
        { product: selectedAccessory, size: accSize, color: selectedAccessory.colors[0], role: "Belt / Accessory" }
      ]
    };

    this.memory.generatedOutfitHistory.unshift({
      id: outfit.id,
      title: outfit.title,
      cost: outfit.totalCost,
      timestamp: Date.now()
    });
    if (this.memory.generatedOutfitHistory.length > 10) this.memory.generatedOutfitHistory.pop();
    this.saveMemory();

    return outfit;
  }

  // --- CATALOG FILTERING ---
  getFilteredProducts() {
    return this.products.filter(item => {
      // Search Query
      if (this.filters.searchQuery) {
        const q = this.filters.searchQuery.toLowerCase();
        const matches = item.name.toLowerCase().includes(q) ||
                        item.brand.toLowerCase().includes(q) ||
                        item.description.toLowerCase().includes(q) ||
                        item.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category
      if (this.filters.category !== "all" && item.category !== this.filters.category) {
        return false;
      }

      // Brand
      if (this.filters.brand !== "all" && item.brand.toLowerCase() !== this.filters.brand.toLowerCase()) {
        return false;
      }

      // Max Price
      if (item.price > this.filters.maxPrice) {
        return false;
      }

      // Style
      if (this.filters.styles.length > 0) {
        const hasStyle = this.filters.styles.some(s => item.styles.includes(s));
        if (!hasStyle) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.filters.sortBy === "price-low") return a.price - b.price;
      if (this.filters.sortBy === "price-high") return b.price - a.price;
      if (this.filters.sortBy === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });
  }

  setFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters };
    this.notify("FILTERS_CHANGED", this.filters);
  }

  resetFilters() {
    this.filters = {
      searchQuery: "",
      category: "all",
      brand: "all",
      styles: [],
      maxPrice: 300,
      sortBy: "popular"
    };
    this.notify("FILTERS_CHANGED", this.filters);
  }

  // --- CART OPERATIONS ---
  addToCart(productId, quantity = 1, selectedSize = null, selectedColor = null) {
    const product = this.products.find(p => p.id === productId);
    if (!product) throw new Error(`Product ${productId} not found.`);

    const size = selectedSize || (product.sizes ? product.sizes[0] : "Standard");
    const color = selectedColor || (product.colors ? product.colors[0] : "Standard");

    const existing = this.cart.find(
      i => i.product.id === productId && i.selectedSize === size && i.selectedColor === color
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({
        product: { ...product },
        quantity,
        selectedSize: size,
        selectedColor: color
      });
    }

    this.recordSelection(product);
    this.notify("CART_UPDATED", { action: "ADD", product });
    return this.getCartSummary();
  }

  addOutfitBundleToCart(outfit) {
    for (const piece of outfit.pieces) {
      this.addToCart(piece.product.id, 1, piece.size, piece.color);
    }
    return this.getCartSummary();
  }

  updateCartQuantity(cartIndex, quantity) {
    if (cartIndex < 0 || cartIndex >= this.cart.length) return this.getCartSummary();
    if (quantity <= 0) {
      this.cart.splice(cartIndex, 1);
    } else {
      this.cart[cartIndex].quantity = quantity;
    }
    this.notify("CART_UPDATED", { action: "UPDATE_QTY" });
    return this.getCartSummary();
  }

  removeFromCart(cartIndex) {
    if (cartIndex >= 0 && cartIndex < this.cart.length) {
      this.cart.splice(cartIndex, 1);
      this.notify("CART_UPDATED", { action: "REMOVE" });
    }
    return this.getCartSummary();
  }

  clearCart() {
    this.cart = [];
    this.appliedPromo = null;
    this.notify("CART_UPDATED", { action: "CLEAR" });
    return this.getCartSummary();
  }

  applyPromo(code) {
    const cleanCode = code.trim().toUpperCase();
    const promo = this.promoCodes[cleanCode];
    if (!promo) {
      throw new Error(`Invalid promo code: "${code}". Try "FASHION20" for 20% off.`);
    }
    this.appliedPromo = promo;
    this.notify("PROMO_APPLIED", promo);
    return {
      success: true,
      code: promo.code,
      description: promo.description,
      newTotal: this.getCartSummary().total
    };
  }

  setBudgetLimit(amount) {
    this.budgetLimit = Number(amount);
    this.notify("BUDGET_CHANGED", this.budgetLimit);
  }

  getCartSummary() {
    let subtotal = 0;
    let totalItems = 0;

    for (const item of this.cart) {
      subtotal += item.product.price * item.quantity;
      totalItems += item.quantity;
    }

    let discountAmount = 0;
    if (this.appliedPromo) {
      if (this.appliedPromo.discountPercent) {
        discountAmount = (subtotal * this.appliedPromo.discountPercent) / 100;
      } else if (this.appliedPromo.discountAmount) {
        discountAmount = Math.min(subtotal, this.appliedPromo.discountAmount);
      }
    }

    const estimatedTax = (subtotal - discountAmount) * 0.0825;
    const deliveryFee = subtotal > 75 ? 0 : 9.99;
    const total = Math.max(0, subtotal - discountAmount + estimatedTax + deliveryFee);
    const remainingBudget = this.budgetLimit - total;

    return {
      items: this.cart.map((item, idx) => ({
        index: idx,
        id: item.product.id,
        brand: item.product.brand,
        name: item.product.name,
        price: item.product.price,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        lineTotal: Number((item.product.price * item.quantity).toFixed(2))
      })),
      totalItems,
      subtotal: Number(subtotal.toFixed(2)),
      appliedPromo: this.appliedPromo ? this.appliedPromo.code : null,
      discountAmount: Number(discountAmount.toFixed(2)),
      estimatedTax: Number(estimatedTax.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      total: Number(total.toFixed(2)),
      budgetLimit: this.budgetLimit,
      remainingBudget: Number(remainingBudget.toFixed(2)),
      isOverBudget: remainingBudget < 0
    };
  }

  // --- TELEMETRY ---
  logMcpCall(toolCall) {
    const entry = {
      id: "call-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString(),
      tool: toolCall.name,
      params: toolCall.params,
      result: toolCall.result,
      error: toolCall.error || null,
      durationMs: toolCall.durationMs || 12
    };
    this.mcpLogs.unshift(entry);
    if (this.mcpLogs.length > 50) this.mcpLogs.pop();
    this.notify("MCP_LOGGED", entry);
    return entry;
  }

  // --- APPROVALS ---
  createPendingApproval(orderData) {
    const token = "AUTH-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    this.pendingApproval = {
      token,
      orderData,
      createdAt: Date.now(),
      status: "PENDING"
    };
    this.notify("APPROVAL_REQUESTED", this.pendingApproval);
    return this.pendingApproval;
  }

  authorizePendingApproval(token) {
    if (!this.pendingApproval || this.pendingApproval.token !== token) {
      throw new Error("Invalid or expired checkout approval token.");
    }
    const finalizedOrder = {
      orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      summary: this.getCartSummary(),
      details: this.pendingApproval.orderData,
      status: "CONFIRMED"
    };
    this.orderHistory.unshift(finalizedOrder);
    this.pendingApproval = null;
    this.cart = [];
    this.appliedPromo = null;
    this.notify("ORDER_CONFIRMED", finalizedOrder);
    return finalizedOrder;
  }

  rejectPendingApproval() {
    this.pendingApproval = null;
    this.notify("APPROVAL_REJECTED", null);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventType, payload) {
    for (const listener of this.listeners) {
      try {
        listener(eventType, payload, this);
      } catch (err) {
        console.error("State listener error:", err);
      }
    }
  }
}

export const store = new FashionStateStore();
