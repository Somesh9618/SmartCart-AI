/**
 * SmartCart Fashion AI - Official WebMCP Protocol Implementation
 * Conforming to standard: document.modelContext.registerTool({ name, description, inputSchema, execute })
 */

import { store } from './state.js';

class WebMCPContext {
  constructor() {
    this.version = "1.2.0";
    this.name = "SmartCart Fashion AI Autonomous WebMCP Server";
    this.description = "Agent-native fashion styling, multi-brand apparel & shoe tools, dynamic lookbook generation, and persistent memory.";
    this.tools = new Map();
  }

  /**
   * Official Hackathon WebMCP Tool Registration API
   * document.modelContext.registerTool({ name, description, inputSchema, execute })
   */
  registerTool({ name, description, inputSchema, execute, handler }) {
    const fn = execute || handler;
    if (!name || typeof fn !== 'function') {
      throw new Error(`Invalid tool registration for "${name}". Must provide name and execute function.`);
    }

    const toolObj = {
      name,
      description,
      inputSchema: inputSchema || { type: "object", properties: {} },
      execute: fn,
      handler: fn // backward-compatibility
    };

    this.tools.set(name, toolObj);
    return toolObj;
  }

  async executeTool(name, params = {}) {
    const tool = this.tools.get(name);
    if (!tool) {
      const err = new Error(`WebMCP Tool "${name}" is not registered on document.modelContext.`);
      store.logMcpCall({ name, params, error: err.message, durationMs: 0 });
      throw err;
    }

    const t0 = performance.now();
    try {
      const result = await tool.execute(params);
      const durationMs = Math.round(performance.now() - t0);
      store.logMcpCall({ name, params, result, durationMs });
      return result;
    } catch (error) {
      const durationMs = Math.round(performance.now() - t0);
      store.logMcpCall({ name, params, error: error.message, durationMs });
      throw error;
    }
  }

  getTools() {
    return Array.from(this.tools.values());
  }

  getManifest() {
    return {
      protocol: "WebMCP",
      version: this.version,
      name: this.name,
      tools: this.getTools().map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema
      }))
    };
  }
}

// 1. Initialize global document.modelContext and window.modelContext
const modelContextInstance = new WebMCPContext();

if (typeof window !== "undefined") {
  window.modelContext = modelContextInstance;
}
if (typeof document !== "undefined") {
  try {
    document.modelContext = modelContextInstance;
  } catch (e) {
    // fallback if document is read-only
  }
}

// 2. Register WebMCP Tools using the official registerTool API

// Tool 1: search_products (Official Hackathon Spec)
document.modelContext.registerTool({
  name: "search_products",
  description: "Search 44+ multi-brand clothes, sneakers, jackets, bottoms, and accessories with brand, category, style, and price filters.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search keyword (e.g. 'Nike', 'Oxford', 'Selvedge', 'Chelsea')" },
      brand: { type: "string", description: "Filter by brand name (e.g. 'Nike', 'Levi\\'s', 'Ralph Lauren', 'Adidas')" },
      category: { 
        type: "string", 
        enum: ["all", "tops", "bottoms", "footwear", "accessories"],
        description: "Product category" 
      },
      maxPrice: { type: "number", description: "Max price per item in USD" },
      styles: { type: "array", items: { type: "string" }, description: "Style aesthetics" }
    }
  },
  execute: async (args = {}) => {
    const { query = "", brand = "all", category = "all", maxPrice = 500, styles = [] } = args;

    store.setFilters({
      searchQuery: query,
      brand: brand,
      category: category,
      maxPrice: maxPrice,
      styles: styles
    });

    const results = store.getFilteredProducts().map(p => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      category: p.category,
      price: p.price,
      sizes: p.sizes,
      colors: p.colors,
      styles: p.styles,
      material: p.material,
      stock: p.stock
    }));

    return {
      matchCount: results.length,
      appliedFilters: { query, brand, category, maxPrice, styles },
      products: results.slice(0, 10)
    };
  }
});

// Alias: searchCatalog
document.modelContext.registerTool({
  name: "searchCatalog",
  description: "Alias for search_products.",
  inputSchema: document.modelContext.tools.get("search_products").inputSchema,
  execute: async (args) => document.modelContext.executeTool("search_products", args)
});

// Tool 2: generateDynamicOutfit / generate_outfit
document.modelContext.registerTool({
  name: "generateDynamicOutfit",
  description: "Algorithmically constructs a fresh, unique 4-piece head-to-toe outfit (Top + Bottom + Shoe + Accessory) matching requested style, brand preference, budget, and user wardrobe memory.",
  inputSchema: {
    type: "object",
    properties: {
      style: { 
        type: "string", 
        enum: ["smart_casual", "streetwear", "athletic", "formal", "sustainable"],
        description: "Aesthetic style archetype" 
      },
      occasion: { type: "string", description: "Occasion (e.g. 'Date Night', 'Office', 'Workout', 'Weekend')" },
      preferredBrand: { type: "string", description: "Specific preferred brand (e.g. 'Nike', 'Levi\\'s', 'Ralph Lauren', 'Adidas')" },
      maxBudget: { type: "number", description: "Maximum budget ceiling in USD for all 4 pieces" }
    }
  },
  execute: async (args = {}) => {
    const outfit = store.generateDynamicOutfit({
      style: args.style || "smart_casual",
      occasion: args.occasion || "General Occasion",
      preferredBrand: args.preferredBrand || null,
      maxBudget: args.maxBudget || store.budgetLimit
    });

    return {
      success: true,
      outfitTitle: outfit.title,
      style: outfit.style,
      totalCost: outfit.totalCost,
      piecesCount: outfit.pieces.length,
      pieces: outfit.pieces.map(p => ({
        role: p.role,
        brand: p.product.brand,
        name: p.product.name,
        price: p.product.price,
        selectedSize: p.size,
        selectedColor: p.color
      }))
    };
  }
});

// Tool 3: getUserStyleMemory / get_user_style_memory
document.modelContext.registerTool({
  name: "getUserStyleMemory",
  description: "Retrieves the user's persistent wardrobe memory including saved shoe/clothing sizes, favorite brands, style preferences, and past selections.",
  inputSchema: {
    type: "object",
    properties: {}
  },
  execute: async () => {
    return {
      memory: store.memory,
      savedSizes: store.memory.preferredSizes,
      favoriteBrands: store.memory.favoriteBrands,
      recentPastPicks: store.memory.pastSelections.slice(0, 5)
    };
  }
});

// Tool 4: updateStyleMemory / update_user_style_memory
document.modelContext.registerTool({
  name: "updateStyleMemory",
  description: "Updates user's persistent fashion sizes (shoe, tops, bottoms, belts) or preferred brand affinities.",
  inputSchema: {
    type: "object",
    properties: {
      sizes: {
        type: "object",
        properties: {
          tops: { type: "string", description: "Shirt size (e.g. 'M', 'L', 'XL')" },
          bottoms: { type: "string", description: "Pants size (e.g. '32x32', '34x32')" },
          shoes: { type: "string", description: "Shoe size (e.g. 'US 10', 'US 11')" },
          accessories: { type: "string", description: "Belt size (e.g. '34', '36')" }
        }
      },
      favoriteBrands: { type: "array", items: { type: "string" }, description: "List of preferred brands" },
      preferredStyles: { type: "array", items: { type: "string" }, description: "List of aesthetic styles" }
    }
  },
  execute: async (args = {}) => {
    const updated = store.updateMemoryPreferences({
      sizes: args.sizes,
      brands: args.favoriteBrands,
      styles: args.preferredStyles
    });
    return {
      success: true,
      message: "User style memory updated successfully.",
      updatedMemory: updated
    };
  }
});

// Tool 5: filterCatalog / filter_catalog
document.modelContext.registerTool({
  name: "filterCatalog",
  description: "Applies multi-dimensional catalog filters (brand, category, style, price ceiling, sorting order).",
  inputSchema: {
    type: "object",
    properties: {
      brand: { type: "string", description: "Brand name or 'all'" },
      category: { type: "string", description: "Category name or 'all'" },
      maxPrice: { type: "number", description: "Price ceiling in USD" },
      styles: { type: "array", items: { type: "string" }, description: "Style tags" },
      sortBy: { type: "string", enum: ["popular", "price-low", "price-high", "rating"], description: "Sort criteria" }
    }
  },
  execute: async (args = {}) => {
    store.setFilters({
      brand: args.brand || store.filters.brand,
      category: args.category || store.filters.category,
      maxPrice: args.maxPrice !== undefined ? args.maxPrice : store.filters.maxPrice,
      styles: args.styles || store.filters.styles,
      sortBy: args.sortBy || store.filters.sortBy
    });

    return {
      activeFilters: store.filters,
      totalMatched: store.getFilteredProducts().length
    };
  }
});

// Tool 6: addToCart / add_to_cart
document.modelContext.registerTool({
  name: "addToCart",
  description: "Adds a specific brand apparel or footwear item to the wardrobe cart with selected size and color.",
  inputSchema: {
    type: "object",
    properties: {
      productId: { type: "string", description: "Unique Product ID (e.g. 'top-01', 'shoe-01')" },
      quantity: { type: "number", description: "Quantity (default 1)" },
      size: { type: "string", description: "Selected size" },
      color: { type: "string", description: "Selected color" }
    },
    required: ["productId"]
  },
  execute: async (args) => {
    const summary = store.addToCart(args.productId, args.quantity || 1, args.size, args.color);
    return {
      success: true,
      productId: args.productId,
      cartSummary: {
        totalItems: summary.totalItems,
        subtotal: summary.subtotal,
        total: summary.total,
        remainingBudget: summary.remainingBudget
      }
    };
  }
});

// Tool 7: addDynamicOutfitToCart / add_outfit_bundle
document.modelContext.registerTool({
  name: "addDynamicOutfitToCart",
  description: "Generates a fresh coordinated outfit and immediately adds all 4 matching pieces into the shopping cart.",
  inputSchema: {
    type: "object",
    properties: {
      style: { type: "string", description: "Style aesthetic" },
      occasion: { type: "string", description: "Occasion" },
      preferredBrand: { type: "string", description: "Brand priority" }
    }
  },
  execute: async (args = {}) => {
    const outfit = store.generateDynamicOutfit({
      style: args.style || "smart_casual",
      occasion: args.occasion || "Styling Session",
      preferredBrand: args.preferredBrand || null
    });

    store.addOutfitBundleToCart(outfit);
    const summary = store.getCartSummary();

    return {
      success: true,
      outfitTitle: outfit.title,
      piecesAdded: outfit.pieces.map(p => `${p.product.brand} ${p.product.name} (${p.size})`),
      cartTotal: summary.total,
      remainingBudget: summary.remainingBudget
    };
  }
});

// Tool 8: applyPromoCode / apply_promo
document.modelContext.registerTool({
  name: "applyPromoCode",
  description: "Applies a coupon promo code (e.g. 'FASHION20', 'SNEAKER10', 'FREESHIP') for instant discount.",
  inputSchema: {
    type: "object",
    properties: {
      code: { type: "string", description: "Discount promo code" }
    },
    required: ["code"]
  },
  execute: async (args) => {
    return store.applyPromo(args.code);
  }
});

// Tool 9: getCartSummary / get_cart
document.modelContext.registerTool({
  name: "getCartSummary",
  description: "Retrieves complete active wardrobe cart state, items, sizes, discounts, and budget remaining.",
  inputSchema: {
    type: "object",
    properties: {}
  },
  execute: async () => {
    return store.getCartSummary();
  }
});

// Tool 10: requestCheckoutApproval / request_checkout_approval (Security Guardrail)
document.modelContext.registerTool({
  name: "requestCheckoutApproval",
  description: "SECURITY GUARDRAIL: Generates a human-in-the-loop authorization request before final order placement.",
  inputSchema: {
    type: "object",
    properties: {
      deliveryAddress: { type: "string", description: "Shipping address" },
      deliverySlot: { type: "string", description: "Delivery preference" },
      paymentMethod: { type: "string", description: "Payment method" }
    },
    required: ["deliveryAddress"]
  },
  execute: async (args) => {
    const summary = store.getCartSummary();
    if (summary.totalItems === 0) {
      throw new Error("Cannot checkout with an empty wardrobe cart.");
    }

    const approval = store.createPendingApproval({
      deliveryAddress: args.deliveryAddress,
      deliverySlot: args.deliverySlot || "Express 2-Day Courier Delivery",
      paymentMethod: args.paymentMethod || "Apple Pay",
      summary: summary
    });

    return {
      requiresHumanApproval: true,
      approvalToken: approval.token,
      orderSummary: summary,
      instructions: "Order authorization modal has been triggered on-screen. Wait for human confirmation."
    };
  }
});

// Tool 11: confirmOrder / confirm_order
document.modelContext.registerTool({
  name: "confirmOrder",
  description: "Confirms order using human-authorized approval token.",
  inputSchema: {
    type: "object",
    properties: {
      approvalToken: { type: "string", description: "Authorization token" }
    },
    required: ["approvalToken"]
  },
  execute: async (args) => {
    const order = store.authorizePendingApproval(args.approvalToken);
    return {
      success: true,
      orderId: order.orderId,
      status: "CONFIRMED",
      receipt: order
    };
  }
});

export const webMCP = document.modelContext;
