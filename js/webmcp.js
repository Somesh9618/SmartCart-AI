/**
 * SmartCart AI - Fashion & Footwear WebMCP Protocol Implementation
 * Exposes document.modelContext according to WebMCP standard specification
 */

import { store } from './state.js';
import { CURATED_OUTFITS } from './data.js';

export class WebMCPProtocol {
  constructor() {
    this.version = "1.0.0";
    this.name = "SmartCart AI Fashion & Footwear WebMCP Server";
    this.description = "Agent-native apparel, sneaker, and curated outfit styling tools exposed via browser DOM model context.";
    this.tools = [];
    this.initTools();
    this.bindToGlobals();
  }

  initTools() {
    this.tools = [
      // 1. Search Catalog
      {
        name: "searchCatalog",
        description: "Searches clothes, sneakers, jackets, bottoms, and accessories matching keywords, categories, style tags, and price caps.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search keyword (e.g. 'sneakers', 'hoodie', 'chelsea boots', 'denim', 'linen')" },
            category: { 
              type: "string", 
              enum: ["all", "footwear", "tops", "bottoms", "activewear", "accessories"],
              description: "Apparel or footwear category" 
            },
            maxPrice: { type: "number", description: "Maximum price per item in USD" },
            styles: { 
              type: "array", 
              items: { type: "string", enum: ["streetwear", "smart_casual", "athletic", "sustainable", "formal"] },
              description: "Aesthetic style preferences" 
            }
          }
        },
        handler: async (args = {}) => {
          const { query = "", category = "all", maxPrice = 500, styles = [] } = args;

          store.setFilters({
            searchQuery: query,
            category: category,
            maxPrice: maxPrice,
            styles: styles
          });

          const results = store.getFilteredProducts().map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            sizes: p.sizes,
            colors: p.colors,
            styles: p.styles,
            material: p.material,
            stock: p.stock,
            description: p.description
          }));

          return {
            matchCount: results.length,
            appliedFilters: { query, category, maxPrice, styles },
            products: results.slice(0, 10)
          };
        }
      },

      // 2. Filter Catalog
      {
        name: "filterCatalog",
        description: "Applies multi-dimensional fashion filters (style aesthetics, categories, price ceilings, sorting order).",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string", description: "Category name or 'all'" },
            maxPrice: { type: "number", description: "Price ceiling in USD" },
            styles: { 
              type: "array", 
              items: { type: "string" }, 
              description: "Style tags (e.g. ['streetwear', 'smart_casual'])" 
            },
            sortBy: { 
              type: "string", 
              enum: ["popular", "price-low", "price-high", "rating"],
              description: "Sorting criteria for catalog ranking" 
            }
          }
        },
        handler: async (args = {}) => {
          store.setFilters({
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

      // 3. Get Outfit Suggestions (Lookbook Studio)
      {
        name: "getOutfitSuggestions",
        description: "Retrieves curated head-to-toe outfit lookbooks matching aesthetic style, occasion, and budget caps.",
        inputSchema: {
          type: "object",
          properties: {
            style: { type: "string", description: "Aesthetic (e.g. 'Streetwear', 'Smart Casual', 'Athletic')" },
            occasion: { type: "string", description: "Occasion (e.g. 'Weekend', 'Evening / Office', 'Workout')" },
            maxBudget: { type: "number", description: "Target max budget for the entire outfit in USD" }
          }
        },
        handler: async (args = {}) => {
          const { style = "", maxBudget = 500 } = args;
          
          const matched = CURATED_OUTFITS.filter(outfit => {
            if (style && !outfit.style.toLowerCase().includes(style.toLowerCase())) {
              return false;
            }
            if (outfit.estimatedCost > maxBudget) return false;
            return true;
          });

          return {
            count: matched.length,
            outfits: matched.map(o => ({
              id: o.id,
              name: o.name,
              style: o.style,
              occasion: o.occasion,
              estimatedCost: o.estimatedCost,
              piecesCount: o.piecesCount,
              items: o.items,
              description: o.description
            }))
          };
        }
      },

      // 4. Add Outfit To Cart (Complete Head-to-Toe Bundle)
      {
        name: "addOutfitToCart",
        description: "Adds all coordinated pieces of a curated outfit lookbook to the cart with default or custom sizes.",
        inputSchema: {
          type: "object",
          properties: {
            outfitId: { type: "string", description: "Unique ID of the lookbook outfit (e.g. 'outfit-01', 'outfit-02')" },
            shoeSize: { type: "string", description: "Preferred shoe size (e.g. 'US 10')" },
            clothingSize: { type: "string", description: "Preferred clothing size (e.g. 'M', 'L')" }
          },
          required: ["outfitId"]
        },
        handler: async (args) => {
          const outfit = CURATED_OUTFITS.find(o => o.id === args.outfitId);
          if (!outfit) {
            throw new Error(`Outfit with ID "${args.outfitId}" not found.`);
          }

          const addedItems = [];
          for (const itemRef of outfit.items) {
            const product = store.products.find(p => p.id === itemRef.productId);
            if (product) {
              const chosenSize = product.category === 'footwear' 
                ? (args.shoeSize || itemRef.defaultSize) 
                : (args.clothingSize || itemRef.defaultSize);

              store.addToCart(product.id, 1, chosenSize, product.colors ? product.colors[0] : null);
              addedItems.push({
                productId: product.id,
                name: product.name,
                size: chosenSize,
                unitPrice: product.price
              });
            }
          }

          const cartSummary = store.getCartSummary();
          return {
            outfitName: outfit.name,
            piecesAdded: addedItems,
            cartTotal: cartSummary.total,
            remainingBudget: cartSummary.remainingBudget
          };
        }
      },

      // 5. Add To Cart (Single Item)
      {
        name: "addToCart",
        description: "Adds a specific clothing, shoe, or accessory item to the shopping cart with specified size and color.",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Unique Product ID (e.g. 'shoe-01', 'top-01')" },
            quantity: { type: "number", description: "Quantity to add (default 1)" },
            size: { type: "string", description: "Selected size (e.g. 'M', 'L', 'US 10')" },
            color: { type: "string", description: "Selected color variant" }
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

      // 6. Update Cart Quantity
      {
        name: "updateCartQuantity",
        description: "Modifies the quantity of an item in the cart or removes it if quantity is 0.",
        inputSchema: {
          type: "object",
          properties: {
            cartIndex: { type: "number", description: "Index of the item in the cart" },
            quantity: { type: "number", description: "New desired quantity" }
          },
          required: ["cartIndex", "quantity"]
        },
        handler: async (args) => {
          const summary = store.updateCartQuantity(args.cartIndex, args.quantity);
          return {
            success: true,
            newCartTotal: summary.total
          };
        }
      },

      // 7. Remove From Cart
      {
        name: "removeFromCart",
        description: "Removes an item completely from the shopping cart by index.",
        inputSchema: {
          type: "object",
          properties: {
            cartIndex: { type: "number", description: "Index of the item to remove" }
          },
          required: ["cartIndex"]
        },
        handler: async (args) => {
          const summary = store.removeFromCart(args.cartIndex);
          return {
            success: true,
            cartTotal: summary.total,
            remainingItems: summary.totalItems
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
          const result = store.applyPromo(args.code);
          return result;
        }
      },

      // 9. Get Cart Summary
      {
        name: "getCartSummary",
        description: "Retrieves complete active fashion cart state, line items, sizes, colors, budget calculations, and discounts.",
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
        description: "SECURITY GUARDRAIL: Generates a human-in-the-loop authorization request before payment or final fashion order submission.",
        inputSchema: {
          type: "object",
          properties: {
            deliveryAddress: { type: "string", description: "Shipping address for apparel delivery" },
            deliverySlot: { type: "string", description: "Delivery window preference (e.g. 'Express 2-Day Courier')" },
            paymentMethod: { type: "string", enum: ["Apple Pay", "Credit Card", "Google Pay"], description: "Payment method" }
          },
          required: ["deliveryAddress"]
        },
        handler: async (args) => {
          const summary = store.getCartSummary();
          if (summary.totalItems === 0) {
            throw new Error("Cannot checkout with an empty wardrobe cart. Please add items first.");
          }

          const approval = store.createPendingApproval({
            deliveryAddress: args.deliveryAddress,
            deliverySlot: args.deliverySlot || "Express 2-Day Courier Delivery",
            paymentMethod: args.paymentMethod || "Credit Card (Ending in 4242)",
            summary: summary
          });

          return {
            requiresHumanApproval: true,
            approvalToken: approval.token,
            orderSummary: summary,
            instructions: "Order authorization modal has been triggered for the user on-screen. Wait for human confirmation."
          };
        }
      },

      // 11. Confirm Order
      {
        name: "confirmOrder",
        description: "Confirms order using human-authorized approval token generated by requestCheckoutApproval.",
        inputSchema: {
          type: "object",
          properties: {
            approvalToken: { type: "string", description: "Authorization token provided upon human confirmation" }
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

  // Universal Tool Invocation Bridge
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
      // safe fallback
    }
  }
}

export const webMCP = new WebMCPProtocol();
