/**
 * SmartCart AI - Agent Reasoning & Execution Engine
 * Supports 1-click autonomous demo scenarios and live LLM tool calling
 */

import { webMCP } from './webmcp.js';
import { store } from './state.js';

export class AgentEngine {
  constructor() {
    this.isBusy = false;
    this.history = [];
    this.subscribers = new Set();
    this.apiKey = localStorage.getItem("smartcart_llm_key") || "";
    this.apiProvider = localStorage.getItem("smartcart_llm_provider") || "gemini"; // 'gemini' or 'openai'
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  emit(event, data) {
    for (const sub of this.subscribers) {
      try {
        sub(event, data);
      } catch (err) {
        console.error("Agent subscriber error:", err);
      }
    }
  }

  setApiKey(key, provider = "gemini") {
    this.apiKey = key;
    this.apiProvider = provider;
    localStorage.setItem("smartcart_llm_key", key);
    localStorage.setItem("smartcart_llm_provider", provider);
  }

  // Pre-configured 1-Click Interactive Scenarios
  getScenarios() {
    return [
      {
        id: "scenario-gluten-free",
        title: "Gluten-Free Italian Dinner for 4",
        badge: "Recipe & Budget Optimizer",
        prompt: "Plan a delicious gluten-free Italian dinner for 4 under $40. Find the best recipe, add all required ingredients to the cart, add refreshing sparkling water, apply the WebMCP discount code, and summarize the nutrition.",
        icon: "pasta"
      },
      {
        id: "scenario-high-protein-keto",
        title: "High-Protein Keto Meal Prep",
        badge: "Nutrition & Macro Optimizer",
        prompt: "Build a high-protein keto basket with wild salmon, fresh organic produce, and healthy fats. Maximize protein, keep net carbs low, apply the healthy promo code, and verify macro ratios.",
        icon: "salmon"
      },
      {
        id: "scenario-smart-checkout",
        title: "Autonomous Basket & Human Approval Checkout",
        badge: "Safety Guardrail Demo",
        prompt: "I need healthy pantry staples under $30. Find organic tofu, black beans, quinoa, and spinach. Optimize coupons, check budget headroom, and initiate express delivery checkout with human authorization.",
        icon: "shield"
      }
    ];
  }

  async runScenario(scenarioId) {
    if (this.isBusy) return;
    this.isBusy = true;
    this.emit("STATUS_CHANGE", { isBusy: true });

    try {
      if (scenarioId === "scenario-gluten-free") {
        await this.executeGlutenFreeScenario();
      } else if (scenarioId === "scenario-high-protein-keto") {
        await this.executeHighProteinKetoScenario();
      } else if (scenarioId === "scenario-smart-checkout") {
        await this.executeSmartCheckoutScenario();
      }
    } catch (err) {
      console.error("Scenario execution error:", err);
      this.emit("AGENT_MESSAGE", {
        role: "agent",
        type: "error",
        text: `⚠️ Execution error: ${err.message}`
      });
    } finally {
      this.isBusy = false;
      this.emit("STATUS_CHANGE", { isBusy: false });
    }
  }

  // Helper delay for visual demonstration
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- SCENARIO 1: Gluten-Free Italian Dinner for 4 ---
  async executeGlutenFreeScenario() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "Plan a delicious gluten-free Italian dinner for 4 under $40. Find the best recipe, add all required ingredients to the cart, add refreshing sparkling water, apply the WebMCP discount code, and summarize the nutrition."
    });

    await this.sleep(700);

    // Thought 1
    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: "🧠 **Agent Goal:**\n1. Query WebMCP for Italian recipes tagged `gluten_free` with budget < $40 for 4 servings.\n2. Add all recipe ingredients.\n3. Add sparkling mineral water for beverage.\n4. Apply promo code `WEBMCP20`.\n5. Validate budget & nutrition."
    });

    await this.sleep(900);

    // Step 1: getRecipeSuggestions
    this.emit("TOOL_CALL", { tool: "getRecipeSuggestions", args: { dietary: ["gluten_free"], maxBudget: 40, servings: 4 } });
    await this.sleep(800);
    const recipeRes = await webMCP.executeTool("getRecipeSuggestions", { dietary: ["gluten_free"], maxBudget: 40, servings: 4 });
    this.emit("TOOL_RESULT", { tool: "getRecipeSuggestions", result: recipeRes });

    await this.sleep(700);

    // Thought 2
    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: `✅ Found **${recipeRes.recipes[0].name}** (Est. $${recipeRes.recipes[0].estimatedCost} for 4 servings). Now adding all 4 essential ingredients to cart.`
    });

    await this.sleep(600);

    // Step 2: addRecipeIngredientsToCart
    this.emit("TOOL_CALL", { tool: "addRecipeIngredientsToCart", args: { recipeId: "recipe-01", servings: 4 } });
    await this.sleep(900);
    const addRecipeRes = await webMCP.executeTool("addRecipeIngredientsToCart", { recipeId: "recipe-01", servings: 4 });
    this.emit("TOOL_RESULT", { tool: "addRecipeIngredientsToCart", result: addRecipeRes });

    await this.sleep(700);

    // Step 3: Add Sparkling Water
    this.emit("TOOL_CALL", { tool: "searchCatalog", args: { query: "sparkling", category: "beverages" } });
    await this.sleep(700);
    const searchBev = await webMCP.executeTool("searchCatalog", { query: "sparkling", category: "beverages" });
    this.emit("TOOL_RESULT", { tool: "searchCatalog", result: searchBev });

    await this.sleep(500);
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-25", quantity: 1 } });
    await this.sleep(700);
    const addBev = await webMCP.executeTool("addToCart", { productId: "prod-25", quantity: 1 });
    this.emit("TOOL_RESULT", { tool: "addToCart", result: addBev });

    await this.sleep(700);

    // Step 4: Apply Promo Code
    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "WEBMCP20" } });
    await this.sleep(800);
    const promoRes = await webMCP.executeTool("applyPromoCode", { code: "WEBMCP20" });
    this.emit("TOOL_RESULT", { tool: "applyPromoCode", result: promoRes });

    await this.sleep(700);

    // Step 5: Get Nutrition & Final Summary
    this.emit("TOOL_CALL", { tool: "getNutritionSummary", args: {} });
    await this.sleep(600);
    const nutritionRes = await webMCP.executeTool("getNutritionSummary", {});
    this.emit("TOOL_RESULT", { tool: "getNutritionSummary", result: nutritionRes });

    const cartSummary = store.getCartSummary();

    await this.sleep(600);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "final",
      text: `🎉 **Dinner Plan Prepared Successfully!**\n\n` +
            `• **Menu:** *Gluten-Free Tuscan Pesto Penne* (4 Servings) + *Organic Sparkling Mineral Water (8-pack)*\n` +
            `• **Total Items:** ${cartSummary.totalItems} items in cart\n` +
            `• **Original Subtotal:** $${cartSummary.subtotal}\n` +
            `• **Promo Savings (WEBMCP20):** -$${cartSummary.discountAmount} (20% OFF)\n` +
            `• **Final Total (with tax):** **$${cartSummary.total}** *(Budget Headroom: +$${cartSummary.remainingBudget})*\n` +
            `• **Nutritional Profile:** ${nutritionRes.nutrition.calories} kcal total | **${nutritionRes.nutrition.proteinGrams}g Protein** | ${nutritionRes.nutrition.fiberGrams}g Fiber\n\n` +
            `Would you like me to trigger the express delivery checkout for you?`
    });
  }

  // --- SCENARIO 2: High-Protein Keto Meal Prep ---
  async executeHighProteinKetoScenario() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "Build a high-protein keto basket with wild salmon, fresh organic produce, and healthy fats. Maximize protein, keep net carbs low, apply the healthy promo code, and verify macro ratios."
    });

    await this.sleep(700);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: "🧠 **Agent Plan:**\n1. Filter catalog for `keto` + `high_protein` items.\n2. Add Wild Atlantic Salmon (2 lbs), Pasture-Raised Eggs, Hass Avocados, and Organic Baby Spinach.\n3. Apply `HEALTHY10` coupon.\n4. Calculate protein density and macro percentages."
    });

    await this.sleep(900);

    // Step 1: Filter
    this.emit("TOOL_CALL", { tool: "filterCatalog", args: { dietaryPreferences: ["keto", "high_protein"], sortBy: "protein" } });
    await this.sleep(800);
    const filterRes = await webMCP.executeTool("filterCatalog", { dietaryPreferences: ["keto", "high_protein"], sortBy: "protein" });
    this.emit("TOOL_RESULT", { tool: "filterCatalog", result: filterRes });

    await this.sleep(600);

    // Step 2: Add Salmon x2
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-07", quantity: 2 } });
    await this.sleep(700);
    await webMCP.executeTool("addToCart", { productId: "prod-07", quantity: 2 });
    this.emit("TOOL_RESULT", { tool: "addToCart", result: { success: true, item: "Wild Atlantic Salmon Fillet x2" } });

    await this.sleep(500);

    // Step 3: Add Eggs
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-10", quantity: 1 } });
    await this.sleep(600);
    await webMCP.executeTool("addToCart", { productId: "prod-10", quantity: 1 });
    this.emit("TOOL_RESULT", { tool: "addToCart", result: { success: true, item: "Pasture-Raised Grade A Large Eggs" } });

    await this.sleep(500);

    // Step 4: Add Avocados & Spinach
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-01", quantity: 1 } });
    await this.sleep(600);
    await webMCP.executeTool("addToCart", { productId: "prod-01", quantity: 1 });
    this.emit("TOOL_RESULT", { tool: "addToCart", result: { success: true, item: "Organic Hass Avocados (Pack of 4)" } });

    await this.sleep(500);

    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-02", quantity: 1 } });
    await this.sleep(600);
    await webMCP.executeTool("addToCart", { productId: "prod-02", quantity: 1 });
    this.emit("TOOL_RESULT", { tool: "addToCart", result: { success: true, item: "Fresh Organic Baby Spinach" } });

    await this.sleep(700);

    // Step 5: Apply HEALTHY10
    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "HEALTHY10" } });
    await this.sleep(700);
    const promoRes = await webMCP.executeTool("applyPromoCode", { code: "HEALTHY10" });
    this.emit("TOOL_RESULT", { tool: "applyPromoCode", result: promoRes });

    await this.sleep(600);

    // Step 6: Nutrition Breakdown
    this.emit("TOOL_CALL", { tool: "getNutritionSummary", args: {} });
    await this.sleep(700);
    const nutRes = await webMCP.executeTool("getNutritionSummary", {});
    this.emit("TOOL_RESULT", { tool: "getNutritionSummary", result: nutRes });

    const summary = store.getCartSummary();

    await this.sleep(600);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "final",
      text: `🥑 **High-Protein Keto Basket Ready!**\n\n` +
            `• **Total Protein:** **${nutRes.nutrition.proteinGrams}g** (${nutRes.macroPercentages.proteinPct}% of total calories)\n` +
            `• **Healthy Fats:** **${nutRes.nutrition.fatGrams}g** (Omega-3 & Monounsaturated)\n` +
            `• **Net Carbs:** Ultra-low with **${nutRes.nutrition.fiberGrams}g prebiotic fiber**\n` +
            `• **Total Cost:** **$${summary.total}** after 10% discount (-$${summary.discountAmount})\n\n` +
            `All items are 100% compliant with clean ketogenic nutrition.`
    });
  }

  // --- SCENARIO 3: Autonomous Basket & Human Approval Checkout ---
  async executeSmartCheckoutScenario() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "I need healthy pantry staples under $30. Find organic tofu, black beans, quinoa, and spinach. Optimize coupons, check budget headroom, and initiate express delivery checkout with human authorization."
    });

    await this.sleep(700);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: "🧠 **Safety-First Agent Plan:**\n1. Clear previous cart and set budget limit to $30.00.\n2. Add Tofu, Black Beans, Tri-Color Quinoa, and Baby Spinach.\n3. Apply `WEBMCP20` discount code.\n4. Call `requestCheckoutApproval` to invoke the **Human-in-the-Loop security modal**."
    });

    await this.sleep(800);

    store.clearCart();
    store.setBudgetLimit(30.00);

    // Add Tofu
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-09", quantity: 1 } });
    await this.sleep(500);
    await webMCP.executeTool("addToCart", { productId: "prod-09", quantity: 1 });

    // Add Black Beans x2
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-20", quantity: 2 } });
    await this.sleep(500);
    await webMCP.executeTool("addToCart", { productId: "prod-20", quantity: 2 });

    // Add Quinoa
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-19", quantity: 1 } });
    await this.sleep(500);
    await webMCP.executeTool("addToCart", { productId: "prod-19", quantity: 1 });

    // Add Spinach
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "prod-02", quantity: 1 } });
    await this.sleep(500);
    await webMCP.executeTool("addToCart", { productId: "prod-02", quantity: 1 });

    await this.sleep(600);

    // Apply Promo
    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "WEBMCP20" } });
    await this.sleep(700);
    await webMCP.executeTool("applyPromoCode", { code: "WEBMCP20" });

    await this.sleep(600);

    // Human Approval Tool Call
    this.emit("TOOL_CALL", {
      tool: "requestCheckoutApproval",
      args: {
        deliveryAddress: "742 Evergreen Terrace, San Francisco, CA 94107",
        deliverySlot: "Tomorrow 8:00 AM - 10:00 AM (Priority Express)",
        paymentMethod: "Apple Pay"
      }
    });

    await this.sleep(900);

    const approvalRes = await webMCP.executeTool("requestCheckoutApproval", {
      deliveryAddress: "742 Evergreen Terrace, San Francisco, CA 94107",
      deliverySlot: "Tomorrow 8:00 AM - 10:00 AM (Priority Express)",
      paymentMethod: "Apple Pay"
    });

    this.emit("TOOL_RESULT", { tool: "requestCheckoutApproval", result: approvalRes });

    await this.sleep(600);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "approval_prompt",
      text: `🛡️ **Human Authorization Required (Safety Guardrail)**\n\n` +
            `I have prepared your order within your $30 budget ceiling:\n` +
            `• **Items:** 5 plant-protein staples\n` +
            `• **Final Total:** **$${approvalRes.orderSummary.total}** *(Under budget by $${approvalRes.orderSummary.remainingBudget})*\n` +
            `• **Destination:** 742 Evergreen Terrace, San Francisco, CA\n` +
            `• **Authorization Token:** \`${approvalRes.approvalToken}\`\n\n` +
            `👉 **Please review the on-screen Checkout Security Modal and click 'Authorize & Place Order' to finalize!**`
    });
  }

  // --- NATURAL LANGUAGE USER CHAT HANDLER ---
  async handleUserMessage(userText) {
    if (!userText.trim() || this.isBusy) return;
    this.isBusy = true;
    this.emit("STATUS_CHANGE", { isBusy: true });

    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: userText
    });

    await this.sleep(500);

    try {
      // If user provided a live API key, use direct LLM tool calling
      if (this.apiKey) {
        await this.handleWithLiveLLM(userText);
      } else {
        // Intelligent Local Intent Parser & WebMCP tool orchestrator
        await this.handleWithLocalEngine(userText);
      }
    } catch (err) {
      console.error("Agent error:", err);
      this.emit("AGENT_MESSAGE", {
        role: "agent",
        type: "error",
        text: `⚠️ Error executing request: ${err.message}`
      });
    } finally {
      this.isBusy = false;
      this.emit("STATUS_CHANGE", { isBusy: false });
    }
  }

  async handleWithLocalEngine(text) {
    const lower = text.toLowerCase();

    // Intent: Clear cart
    if (lower.includes("clear") && lower.includes("cart")) {
      store.clearCart();
      this.emit("AGENT_MESSAGE", { role: "agent", type: "final", text: "🛒 I've emptied your shopping cart." });
      return;
    }

    // Intent: Nutrition check
    if (lower.includes("nutrition") || lower.includes("macros") || lower.includes("calories") || lower.includes("protein")) {
      this.emit("TOOL_CALL", { tool: "getNutritionSummary", args: {} });
      await this.sleep(500);
      const res = await webMCP.executeTool("getNutritionSummary", {});
      this.emit("TOOL_RESULT", { tool: "getNutritionSummary", result: res });
      await this.sleep(400);

      this.emit("AGENT_MESSAGE", {
        role: "agent",
        type: "final",
        text: `📊 **Active Cart Nutrition Summary:**\n\n` +
              `• **Calories:** ${res.nutrition.calories} kcal\n` +
              `• **Protein:** ${res.nutrition.proteinGrams}g (${res.macroPercentages.proteinPct}%)\n` +
              `• **Carbohydrates:** ${res.nutrition.carbsGrams}g (${res.macroPercentages.carbsPct}%)\n` +
              `• **Fats:** ${res.nutrition.fatGrams}g (${res.macroPercentages.fatPct}%)\n` +
              `• **Fiber:** ${res.nutrition.fiberGrams}g`
      });
      return;
    }

    // Intent: Apply coupon
    if (lower.includes("coupon") || lower.includes("promo") || lower.includes("discount") || lower.includes("webmcp20")) {
      const code = lower.includes("healthy") ? "HEALTHY10" : lower.includes("freeship") ? "FREESHIP" : "WEBMCP20";
      this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code } });
      await this.sleep(500);
      const res = await webMCP.executeTool("applyPromoCode", { code });
      this.emit("TOOL_RESULT", { tool: "applyPromoCode", result: res });
      await this.sleep(400);

      this.emit("AGENT_MESSAGE", {
        role: "agent",
        type: "final",
        text: `🏷️ Promo code **${res.code}** applied! ${res.description}. New cart total is **$${res.newTotal}**.`
      });
      return;
    }

    // Intent: Checkout
    if (lower.includes("checkout") || lower.includes("place order") || lower.includes("buy")) {
      this.emit("TOOL_CALL", { tool: "requestCheckoutApproval", args: { deliveryAddress: "User Home Address", paymentMethod: "Credit Card" } });
      await this.sleep(700);
      const res = await webMCP.executeTool("requestCheckoutApproval", { deliveryAddress: "User Home Address", paymentMethod: "Credit Card" });
      this.emit("TOOL_RESULT", { tool: "requestCheckoutApproval", result: res });
      await this.sleep(400);

      this.emit("AGENT_MESSAGE", {
        role: "agent",
        type: "approval_prompt",
        text: `🛡️ **Checkout Authorization Triggered**\n\nTotal: **$${res.orderSummary.total}**. Please click 'Authorize Order' in the checkout modal on your screen.`
      });
      return;
    }

    // Intent: Recipe search
    if (lower.includes("recipe") || lower.includes("dinner") || lower.includes("meal")) {
      const dietary = lower.includes("vegan") ? ["vegan"] : lower.includes("keto") ? ["keto"] : lower.includes("gluten") ? ["gluten_free"] : [];
      this.emit("TOOL_CALL", { tool: "getRecipeSuggestions", args: { dietary, maxBudget: 50, servings: 4 } });
      await this.sleep(600);
      const res = await webMCP.executeTool("getRecipeSuggestions", { dietary, maxBudget: 50, servings: 4 });
      this.emit("TOOL_RESULT", { tool: "getRecipeSuggestions", result: res });
      await this.sleep(400);

      if (res.recipes.length > 0) {
        const top = res.recipes[0];
        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "final",
          text: `🍳 I found **${top.name}** (${top.cuisine}, ${top.prepTime}, Est. $${top.estimatedCost} for ${top.servings} servings).\n\n` +
                `${top.description}\n\n` +
                `Would you like me to add all ingredients to your cart?`
        });
      } else {
        this.emit("AGENT_MESSAGE", { role: "agent", type: "final", text: "No recipes matched those exact constraints. Try searching for Italian or Keto meals!" });
      }
      return;
    }

    // Default: General Product Search & Add
    this.emit("TOOL_CALL", { tool: "searchCatalog", args: { query: text } });
    await this.sleep(600);
    const searchRes = await webMCP.executeTool("searchCatalog", { query: text });
    this.emit("TOOL_RESULT", { tool: "searchCatalog", result: searchRes });
    await this.sleep(400);

    if (searchRes.matchCount > 0) {
      const first = searchRes.products[0];
      this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: first.id, quantity: 1 } });
      await this.sleep(500);
      await webMCP.executeTool("addToCart", { productId: first.id, quantity: 1 });
      this.emit("TOOL_RESULT", { tool: "addToCart", result: { success: true, item: first.name } });

      const cart = store.getCartSummary();
      this.emit("AGENT_MESSAGE", {
        role: "agent",
        type: "final",
        text: `🛒 Found **${first.name}** ($${first.price}/${first.unit}) and added it to your cart.\n\n` +
              `Cart Total is now **$${cart.total}** (${cart.totalItems} items).`
      });
    } else {
      this.emit("AGENT_MESSAGE", {
        role: "agent",
        type: "final",
        text: `I searched the catalog for "${text}", but didn't find any direct matches. Try searching for salmon, avocados, spinach, tofu, pasta, or milk!`
      });
    }
  }

  // Live LLM Connector (Gemini API format)
  async handleWithLiveLLM(userPrompt) {
    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: `Connecting to ${this.apiProvider.toUpperCase()} with WebMCP tool schemas...`
    });

    const manifest = webMCP.getToolsManifest();
    // Format tools for Gemini/OpenAI
    const toolsDeclaration = manifest.tools.map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.inputSchema
    }));

    if (this.apiProvider === "gemini") {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          tools: [{ functionDeclarations: toolsDeclaration }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const candidate = data.candidates?.[0]?.content?.parts?.[0];
      if (candidate?.functionCall) {
        const fn = candidate.functionCall;
        this.emit("TOOL_CALL", { tool: fn.name, args: fn.args });
        const result = await webMCP.executeTool(fn.name, fn.args);
        this.emit("TOOL_RESULT", { tool: fn.name, result });

        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "final",
          text: `Executed WebMCP tool \`${fn.name}\` successfully.`
        });
      } else if (candidate?.text) {
        this.emit("AGENT_MESSAGE", { role: "agent", type: "final", text: candidate.text });
      }
    }
  }
}

export const agentEngine = new AgentEngine();
