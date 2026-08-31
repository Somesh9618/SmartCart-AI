/**
 * SmartCart Fashion AI - WebMCP Protocol Implementation
 * Exposes document.modelContext with Dynamic Outfit Generation & User Style Memory
 */

import { store } from './state.js';

export class WebMCPProtocol {
  constructor() {
    this.version = "1.2.0";
    this.name = "SmartCart Fashion AI Autonomous WebMCP Server";
    this.description = "Agent-native fashion styling, multi-brand apparel & shoe tools, dynamic lookbook generation, and persistent memory.";
    this.tools = [];
    this.initTools();
    this.bindToGlobals();
  }

  initTools() {
    this.tools = [
      // 1. Generate Dynamic Unique Outfit (Algorithmic Coordinated Look)
      {
        name: "generateDynamicOutfit",
        description: "Algorithmically constructs a fresh, unique 4-piece head-to-toe outfit (Top + Bottom + Shoe + Accessory) matching requested style, brand preference, budget, and user memory.",
        inputSchema: {
          type: "object",
          properties: {
            style: { 
              type: "string", 
              enum: ["smart_casual", "streetwear", "athletic", "formal", "sustainable"],
              description: "Aesthetic style archetype" 
            },
            occasion: { type: "string", description: "Occasion (e.g. 'Date Night', 'Office', 'Workout', 'Weekend')" },
            preferredBrand: { type: "string", description: "Specific preferred brand (e.g. 'Nike', 'Levi\'s', 'Ralph Lauren', 'Adidas')" },
            maxBudget: { type: "number", description: "Maximum budget ceiling in USD for all 4 pieces" }
          }
        },
        handler: async (args = {}) => {
          const outfit = store.generateDynamicOutfit({
            style: args.style || "smart_casual",
            occasion: args.occasion || "General Occasion",
            preferredBrand: args.preferredBrand || null,
            maxBudget: args.maxBudget || 400
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
      },

      // 2. Get User Style Memory Profile
      {
        name: "getUserStyleMemory",
        description: "Retrieves the user's persistent wardrobe memory including saved shoe/clothing sizes, favorite brands, style preferences, and past selections.",
        inputSchema: {
          type: "object",
          properties: {}
        },
        handler: async () => {
          return {
            memory: store.memory,
            savedSizes: store.memory.preferredSizes,
            favoriteBrands: store.memory.favoriteBrands,
            recentPastPicks: store.memory.pastSelections.slice(0, 5)
          };
        }
      },

      // 3. Update User Style Memory
      {
        name: "updateStyleMemory",
        description: "Updates user's persistent fashion sizes (shoe, tops, bottoms) or preferred brand affinities.",
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
        handler: async (args = {}) => {
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
      },

      // 4. Search Catalog
      {
        name: "searchCatalog",
        description: "Searches clothes, sneakers, jackets, bottoms, and accessories matching keywords, brands, categories, style tags, and price caps.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search keyword (e.g. 'Nike', 'Oxford', 'Selvedge', 'Chelsea')" },
            brand: { type: "string", description: "Filter by brand name" },
            category: { 
              type: "string", 
              enum: ["all", "tops", "bottoms", "footwear", "accessories"],
              description: "Product category" 
            },
            maxPrice: { type: "number", description: "Max price per item in USD" },
            styles: { type: "array", items: { type: "string" }, description: "Style aesthetics" }
          }
        },
        handler: async (args = {}) => {
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
      },

      // 5. Filter Catalog
      {
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
        handler: async (args = {}) => {
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
      },

      // 6. Add Single Item To Cart
      {
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
        handler: async (args) => {
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
      },

      // 7. Add Full Dynamic Outfit Bundle To Cart
      {
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
        handler: async (args = {}) => {
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
      },

      // 8. Apply Promo Code
      {
        name: "applyPromoCode",
        description: "Applies a coupon promo code (e.g. 'FASHION20', 'SNEAKER10', 'FREESHIP') for instant discount.",
        inputSchema: {
          type: "object",
          properties: {
            code: { type: "string", description: "Discount promo code" }
          },
          required: ["code"]
        },
        handler: async (args) => {
          return store.applyPromo(args.code);
        }
      },

      // 9. Get Cart Summary
      {
        name: "getCartSummary",
        description: "Retrieves complete active wardrobe cart state, items, sizes, discounts, and budget remaining.",
        inputSchema: {
          type: "object",
          properties: {}
        },
        handler: async () => {
          return store.getCartSummary();
        }
      },

      // 10. Request Checkout Approval (Human-in-the-Loop Safety Guardrail)
      {
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
        handler: async (args) => {
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
      },

      // 11. Confirm Order
      {
        name: "confirmOrder",
        description: "Confirms order using human-authorized approval token.",
        inputSchema: {
          type: "object",
          properties: {
            approvalToken: { type: "string", description: "Authorization token" }
          },
          required: ["approvalToken"]
        },
        handler: async (args) => {
          const order = store.authorizePendingApproval(args.approvalToken);
          return {
            success: true,
            orderId: order.orderId,
            status: "CONFIRMED",
            receipt: order
          };
        }
      }
    ];
  }

  async executeTool(name, params = {}) {
    const tool = this.tools.find(t => t.name === name);
    if (!tool) {
      const err = new Error(`WebMCP Tool "${name}" is not registered.`);
      store.logMcpCall({ name, params, error: err.message, durationMs: 0 });
      throw err;
    }

    const t0 = performance.now();
    try {
      const result = await tool.handler(params);
      const durationMs = Math.round(performance.now() - t0);
      store.logMcpCall({ name, params, result, durationMs });
      return result;
    } catch (error) {
      const durationMs = Math.round(performance.now() - t0);
      store.logMcpCall({ name, params, error: error.message, durationMs });
      throw error;
    }
  }

  getToolsManifest() {
    return {
      protocol: "WebMCP",
      version: this.version,
      name: this.name,
      tools: this.tools.map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema
      }))
    };
  }

  bindToGlobals() {
    const mcpContext = {
      version: this.version,
      tools: this.tools,
      executeTool: (name, args) => this.executeTool(name, args),
      getManifest: () => this.getToolsManifest()
    };

    window.modelContext = mcpContext;
    try {
      document.modelContext = mcpContext;
    } catch (e) {
      // fallback
    }
  }
}

export const webMCP = new WebMCPProtocol();
