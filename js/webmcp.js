/**
 * SmartCart AI - WebMCP Protocol Implementation
 * Exposes document.modelContext according to WebMCP standard specification
 */

import { store } from './state.js';
import { CHEF_RECIPES } from './data.js';

export class WebMCPProtocol {
  constructor() {
    this.version = "1.0.0";
    this.name = "SmartCart AI Autonomous Supermarket WebMCP Server";
    this.description = "Agent-native supermarket & recipe optimization tools exposed via browser DOM model context.";
    this.tools = [];
    this.initTools();
    this.bindToGlobals();
  }

  initTools() {
    this.tools = [
      // 1. Search Catalog
      {
        name: "searchCatalog",
        description: "Searches available supermarket grocery products matching keywords, categories, dietary constraints, and price caps.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search keyword (e.g. 'spinach', 'salmon', 'milk', 'pasta')" },
            category: { 
              type: "string", 
              enum: ["all", "produce", "protein", "dairy", "pantry", "bakery", "snacks", "beverages"],
              description: "Product category filter" 
            },
            maxPrice: { type: "number", description: "Maximum price per unit in USD" },
            dietary: { 
              type: "array", 
              items: { type: "string", enum: ["organic", "vegan", "keto", "gluten_free", "high_protein"] },
              description: "Dietary restrictions or preferences" 
            }
          }
        },
        handler: async (args = {}) => {
          const startTime = performance.now();
          const { query = "", category = "all", maxPrice = 100, dietary = [] } = args;

          // Update UI filters to reflect agent exploration
          store.setFilters({
            searchQuery: query,
            category: category,
            maxPrice: maxPrice,
            dietary: dietary
          });

          const results = store.getFilteredProducts().map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            unit: p.unit,
            dietary: p.dietary,
            calories: p.nutrition.calories,
            protein: p.nutrition.protein,
            stock: p.stock,
            description: p.description
          }));

          return {
            matchCount: results.length,
            appliedFilters: { query, category, maxPrice, dietary },
            products: results.slice(0, 10)
          };
        }
      },

      // 2. Filter Catalog
      {
        name: "filterCatalog",
        description: "Applies multi-dimensional catalog filters (sort order, dietary badges, max price).",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string", description: "Category name or 'all'" },
            maxPrice: { type: "number", description: "Price ceiling in USD" },
            dietaryPreferences: { 
              type: "array", 
              items: { type: "string" }, 
              description: "List of dietary tags (e.g. ['organic', 'gluten_free'])" 
            },
            sortBy: { 
              type: "string", 
              enum: ["popular", "price-low", "price-high", "protein", "rating"],
              description: "Sorting criteria for catalog ranking" 
            }
          }
        },
        handler: async (args = {}) => {
          store.setFilters({
            category: args.category || store.filters.category,
            maxPrice: args.maxPrice !== undefined ? args.maxPrice : store.filters.maxPrice,
            dietary: args.dietaryPreferences || store.filters.dietary,
            sortBy: args.sortBy || store.filters.sortBy
          });

          return {
            activeFilters: store.filters,
            totalMatched: store.getFilteredProducts().length
          };
        }
      },

      // 3. Get Recipe Suggestions
      {
        name: "getRecipeSuggestions",
        description: "Retrieves curated chef recipes matched by cuisine, meal type, dietary restriction, budget, and serving size.",
        inputSchema: {
          type: "object",
          properties: {
            dietary: { 
              type: "array", 
              items: { type: "string" },
              description: "Dietary criteria (e.g. ['gluten_free'], ['keto'], ['vegan'])" 
            },
            maxBudget: { type: "number", description: "Target max budget in USD" },
            servings: { type: "number", description: "Desired number of servings (default 2-4)" }
          }
        },
        handler: async (args = {}) => {
          const { dietary = [], maxBudget = 100, servings = 4 } = args;
          
          const matched = CHEF_RECIPES.filter(recipe => {
            if (dietary.length > 0) {
              const matchesDiet = dietary.every(tag => recipe.dietary.includes(tag));
              if (!matchesDiet) return false;
            }
            if (recipe.estimatedCost > maxBudget) return false;
            return true;
          });

          return {
            count: matched.length,
            recipes: matched.map(r => ({
              id: r.id,
              name: r.name,
              cuisine: r.cuisine,
              prepTime: r.prepTime,
              servings: r.servings,
              estimatedCost: r.estimatedCost,
              dietary: r.dietary,
              nutritionPerServing: r.nutritionPerServing,
              ingredientsCount: r.ingredients.length,
              description: r.description
            }))
          };
        }
      },

      // 4. Add Recipe Ingredients To Cart
      {
        name: "addRecipeIngredientsToCart",
        description: "Automatically resolves and adds all required ingredient items from a recipe into the active cart.",
        inputSchema: {
          type: "object",
          properties: {
            recipeId: { type: "string", description: "Unique ID of the recipe (e.g. 'recipe-01')" },
            servings: { type: "number", description: "Scale factor for servings (e.g. 4)" },
            preferOrganic: { type: "boolean", description: "Whether to prioritize organic certified items" }
          },
          required: ["recipeId"]
        },
        handler: async (args) => {
          const recipe = CHEF_RECIPES.find(r => r.id === args.recipeId);
          if (!recipe) {
            throw new Error(`Recipe with ID "${args.recipeId}" not found.`);
          }

          const addedItems = [];
          for (const ing of recipe.ingredients) {
            const product = store.products.find(p => p.id === ing.productId);
            if (product) {
              store.addToCart(product.id, ing.quantity);
              addedItems.push({
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                quantityAdded: ing.quantity
              });
            }
          }

          const cartSummary = store.getCartSummary();
          return {
            recipeName: recipe.name,
            addedIngredients: addedItems,
            cartTotal: cartSummary.total,
            remainingBudget: cartSummary.remainingBudget
          };
        }
      },

      // 5. Add To Cart
      {
        name: "addToCart",
        description: "Adds a specific grocery product to the shopping cart by product ID and quantity.",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Unique Product ID (e.g. 'prod-01', 'prod-07')" },
            quantity: { type: "number", description: "Quantity to add (default 1)" }
          },
          required: ["productId"]
        },
        handler: async (args) => {
          const summary = store.addToCart(args.productId, args.quantity || 1);
          const item = summary.items.find(i => i.id === args.productId);
          return {
            success: true,
            itemAdded: item,
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
        description: "Modifies the quantity of an existing item in the cart or removes it if quantity is 0.",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Unique Product ID" },
            quantity: { type: "number", description: "New desired quantity" }
          },
          required: ["productId", "quantity"]
        },
        handler: async (args) => {
          const summary = store.updateCartQuantity(args.productId, args.quantity);
          return {
            success: true,
            productId: args.productId,
            newQuantity: args.quantity,
            newCartTotal: summary.total
          };
        }
      },

      // 7. Remove From Cart
      {
        name: "removeFromCart",
        description: "Removes an item completely from the shopping cart.",
        inputSchema: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Unique Product ID to remove" }
          },
          required: ["productId"]
        },
        handler: async (args) => {
          const summary = store.removeFromCart(args.productId);
          return {
            success: true,
            productId: args.productId,
            cartTotal: summary.total,
            remainingItems: summary.totalItems
          };
        }
      },

      // 8. Apply Promo Code
      {
        name: "applyPromoCode",
        description: "Applies a coupon promo code (e.g. 'WEBMCP20', 'HEALTHY10', 'FREESHIP') for instant discount.",
        inputSchema: {
          type: "object",
          properties: {
            code: { type: "string", description: "Coupon or discount code" }
          },
          required: ["code"]
        },
        handler: async (args) => {
          const result = store.applyPromo(args.code);
          return result;
        }
      },

      // 9. Get Nutrition Summary
      {
        name: "getNutritionSummary",
        description: "Calculates the total nutritional profile (Calories, Protein, Carbs, Fats, Fiber) across all current items in the cart.",
        inputSchema: {
          type: "object",
          properties: {}
        },
        handler: async () => {
          const summary = store.getCartSummary();
          return {
            nutrition: summary.nutrition,
            itemCount: summary.totalItems,
            macroPercentages: {
              proteinPct: Math.round(((summary.nutrition.proteinGrams * 4) / Math.max(1, summary.nutrition.calories)) * 100),
              carbsPct: Math.round(((summary.nutrition.carbsGrams * 4) / Math.max(1, summary.nutrition.calories)) * 100),
              fatPct: Math.round(((summary.nutrition.fatGrams * 9) / Math.max(1, summary.nutrition.calories)) * 100)
            }
          };
        }
      },

      // 10. Get Cart Summary
      {
        name: "getCartSummary",
        description: "Retrieves complete active cart state, line items, budget calculations, applied discounts, and fees.",
        inputSchema: {
          type: "object",
          properties: {}
        },
        handler: async () => {
          return store.getCartSummary();
        }
      },

      // 11. Request Checkout Approval (Human-in-the-Loop Safety Guardrail)
      {
        name: "requestCheckoutApproval",
        description: "SECURITY GUARDRAIL: Generates a human-in-the-loop authorization request before payment or final order submission.",
        inputSchema: {
          type: "object",
          properties: {
            deliveryAddress: { type: "string", description: "Shipping / delivery destination address" },
            deliverySlot: { type: "string", description: "Preferred delivery window (e.g. 'Tomorrow 9:00 AM - 11:00 AM')" },
            paymentMethod: { type: "string", enum: ["Apple Pay", "Credit Card", "Google Pay"], description: "Selected payment method" }
          },
          required: ["deliveryAddress"]
        },
        handler: async (args) => {
          const summary = store.getCartSummary();
          if (summary.totalItems === 0) {
            throw new Error("Cannot checkout with an empty cart. Please add items first.");
          }

          const approval = store.createPendingApproval({
            deliveryAddress: args.deliveryAddress,
            deliverySlot: args.deliverySlot || "Tomorrow 10:00 AM - 12:00 PM (Express)",
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

      // 12. Confirm Order
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

  // Export Tools JSON Schema for inspection or LLM system prompt injection
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

  // Expose on standard DOM properties
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
      // In case document is not fully writable in some sandboxes
    }
  }
}

export const webMCP = new WebMCPProtocol();
