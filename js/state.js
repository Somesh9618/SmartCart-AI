/**
 * SmartCart AI - Fashion & Footwear Reactive State Store
 * Centralized state management for apparel, shoes, outfit bundles, and WebMCP telemetry
 */

import { INITIAL_PRODUCTS, CURATED_OUTFITS, PROMO_CODES } from './data.js';

class FashionStateStore {
  constructor() {
    this.products = [...INITIAL_PRODUCTS];
    this.outfits = [...CURATED_OUTFITS];
    this.promoCodes = { ...PROMO_CODES };

    // Shopping Cart State (Items have productId, quantity, selectedSize, selectedColor)
    this.cart = [];
    this.appliedPromo = null;
    this.budgetLimit = 300.00; // default $300 budget for fashion/outfits

    // Catalog Filter State
    this.filters = {
      searchQuery: "",
      category: "all", // 'all', 'footwear', 'tops', 'bottoms', 'activewear', 'accessories'
      styles: [],      // ['streetwear', 'smart_casual', 'athletic', 'sustainable', 'formal']
      maxPrice: 200,
      sortBy: "popular" // 'popular', 'price-low', 'price-high', 'rating'
    };

    // Human-in-the-Loop Approval State
    this.pendingApproval = null;
    this.orderHistory = [];

    // WebMCP Execution Stream / Telemetry
    this.mcpLogs = [];

    // Subscribers
    this.listeners = new Set();
  }

  // Subscribe to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventType, payload) {
    for (const listener of this.listeners) {
      try {
        listener(eventType, payload, this);
      } catch (err) {
        console.error("Error in state subscriber:", err);
      }
    }
  }

  // --- CATALOG METHODS ---
  getFilteredProducts() {
    return this.products.filter(item => {
      // Search Query
      if (this.filters.searchQuery) {
        const query = this.filters.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesMat = item.material.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesMat) return false;
      }

      // Category
      if (this.filters.category !== "all" && item.category !== this.filters.category) {
        return false;
      }

      // Max Price
      if (item.price > this.filters.maxPrice) {
        return false;
      }

      // Style Filters
      if (this.filters.styles.length > 0) {
        const hasMatch = this.filters.styles.some(s => item.styles.includes(s));
        if (!hasMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.filters.sortBy === "price-low") return a.price - b.price;
      if (this.filters.sortBy === "price-high") return b.price - a.price;
      if (this.filters.sortBy === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews; // default popular
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
      styles: [],
      maxPrice: 200,
      sortBy: "popular"
    };
    this.notify("FILTERS_CHANGED", this.filters);
  }

  // --- CART METHODS ---
  addToCart(productId, quantity = 1, selectedSize = null, selectedColor = null) {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      throw new Error(`Product with ID "${productId}" not found in catalog.`);
    }

    if (product.stock < quantity) {
      throw new Error(`Only ${product.stock} units available for ${product.name}.`);
    }

    const size = selectedSize || (product.sizes ? product.sizes[0] : "Standard");
    const color = selectedColor || (product.colors ? product.colors[0] : "Standard");

    // Match by product ID AND selected size/color
    const existingIndex = this.cart.findIndex(
      item => item.product.id === productId && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        product: { ...product },
        quantity,
        selectedSize: size,
        selectedColor: color
      });
    }

    this.notify("CART_UPDATED", { action: "ADD", product, quantity, size, color });
    return this.getCartSummary();
  }

  updateCartQuantity(cartIndex, quantity) {
    if (cartIndex < 0 || cartIndex >= this.cart.length) {
      throw new Error(`Invalid cart item index.`);
    }

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
      throw new Error(`Invalid promo code: "${code}". Try "FASHION20" for 20% off or "SNEAKER10".`);
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

  // --- AGGREGATED CALCULATIONS ---
  getCartSummary() {
    let subtotal = 0;
    let totalItems = 0;

    for (const item of this.cart) {
      const linePrice = item.product.price * item.quantity;
      subtotal += linePrice;
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

    const estimatedTax = (subtotal - discountAmount) * 0.0825; // 8.25% sales tax
    const deliveryFee = subtotal > 75 ? 0 : 9.99; // Free shipping over $75
    const total = Math.max(0, subtotal - discountAmount + estimatedTax + deliveryFee);
    const remainingBudget = this.budgetLimit - total;

    return {
      items: this.cart.map((item, idx) => ({
        index: idx,
        id: item.product.id,
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

  // --- WEBMCP LOGGING & TELEMETRY ---
  logMcpCall(toolCall) {
    const entry = {
      id: "call-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString(),
      tool: toolCall.name,
      params: toolCall.params,
      result: toolCall.result,
      error: toolCall.error || null,
      durationMs: toolCall.durationMs || 10
    };
    this.mcpLogs.unshift(entry);
    if (this.mcpLogs.length > 50) this.mcpLogs.pop();
    this.notify("MCP_LOGGED", entry);
    return entry;
  }

  // --- HUMAN IN THE LOOP APPROVALS ---
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
}

export const store = new FashionStateStore();
