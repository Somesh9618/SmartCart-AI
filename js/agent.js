/**
 * SmartCart Fashion AI - Memory-Aware Agent Reasoning Engine
 * Dynamically generates unique outfit combinations and recalls user style memory
 */

import { webMCP } from './webmcp.js';
import { store } from './state.js';

export class FashionAgentEngine {
  constructor() {
    this.isBusy = false;
    this.history = [];
    this.subscribers = new Set();
    this.apiKey = localStorage.getItem("smartcart_llm_key") || "";
    this.apiProvider = localStorage.getItem("smartcart_llm_provider") || "gemini";
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

  getScenarios() {
    return [
      {
        id: "scenario-dynamic-smart-casual",
        title: "Dynamic Smart Casual Ensemble",
        badge: "Memory-Aware Unique Styling",
        prompt: "Generate a fresh, unique Smart Casual outfit matching my saved wardrobe sizes and favorite brands. Auto-assemble the 4 coordinated pieces into my cart, apply the 20% discount code, and summarize savings.",
        icon: "suit"
      },
      {
        id: "scenario-dynamic-athletic",
        title: "Dynamic Athletic & Sneaker Fit",
        badge: "Multi-Brand Running Set",
        prompt: "Generate a high-performance activewear set with premium running shoes, workout top, and joggers matching my profile. Apply the sneaker promo code.",
        icon: "running"
      },
      {
        id: "scenario-dynamic-streetwear",
        title: "Autonomous Multi-Brand Streetwear & Checkout",
        badge: "Safety Guardrail Demo",
        prompt: "Style an urban streetwear outfit with heavy hoodie, selvedge denim, retro sneakers, and an accessory under $350. Apply coupon and initiate human-authorized checkout.",
        icon: "shield"
      }
    ];
  }

  async runScenario(scenarioId) {
    if (this.isBusy) return;
    this.isBusy = true;
    this.emit("STATUS_CHANGE", { isBusy: true });

    try {
      if (scenarioId === "scenario-dynamic-smart-casual") {
        await this.executeDynamicSmartCasual();
      } else if (scenarioId === "scenario-dynamic-athletic") {
        await this.executeDynamicAthletic();
      } else if (scenarioId === "scenario-dynamic-streetwear") {
        await this.executeDynamicStreetwear();
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

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- SCENARIO 1: Dynamic Smart Casual (Memory-Aware) ---
  async executeDynamicSmartCasual() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "Generate a fresh, unique Smart Casual outfit matching my saved wardrobe sizes and favorite brands. Auto-assemble the 4 coordinated pieces into my cart, apply the 20% discount code, and summarize savings."
    });

    await this.sleep(700);

    // Step 1: Read user memory
    this.emit("TOOL_CALL", { tool: "getUserStyleMemory", args: {} });
    await this.sleep(600);
    const memRes = await webMCP.executeTool("getUserStyleMemory", {});
    this.emit("TOOL_RESULT", { tool: "getUserStyleMemory", result: memRes });

    await this.sleep(500);

    const sizes = memRes.savedSizes;
    const favBrands = memRes.favoriteBrands.slice(0, 3).join(", ") || "Ralph Lauren, Levi's";

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: `🧠 **Stylist Memory Recall:**\n• Saved Sizes: Shoe \`${sizes.shoes}\`, Top \`${sizes.tops}\`, Bottom \`${sizes.bottoms}\`, Belt \`${sizes.accessories}\`\n• Preferred Brands: *${favBrands}*\n\nGenerating a brand-new unique combination tailored to your profile...`
    });

    await this.sleep(800);

    // Step 2: Generate dynamic outfit
    this.emit("TOOL_CALL", { tool: "generateDynamicOutfit", args: { style: "smart_casual", occasion: "Date Night & Evening", maxBudget: 400 } });
    await this.sleep(900);
    const outfitRes = await webMCP.executeTool("generateDynamicOutfit", { style: "smart_casual", occasion: "Date Night & Evening", maxBudget: 400 });
    this.emit("TOOL_RESULT", { tool: "generateDynamicOutfit", result: outfitRes });

    await this.sleep(600);

    // Step 3: Add to cart
    this.emit("TOOL_CALL", { tool: "addDynamicOutfitToCart", args: { style: "smart_casual", occasion: "Date Night & Evening" } });
    await this.sleep(800);
    await webMCP.executeTool("addDynamicOutfitToCart", { style: "smart_casual", occasion: "Date Night & Evening" });

    await this.sleep(600);

    // Step 4: Apply promo code
    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "FASHION20" } });
    await this.sleep(700);
    const promoRes = await webMCP.executeTool("applyPromoCode", { code: "FASHION20" });
    this.emit("TOOL_RESULT", { tool: "applyPromoCode", result: promoRes });

    await this.sleep(500);

    const summary = store.getCartSummary();

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "final",
      text: `✨ **Fresh Smart Casual Look Assembled!**\n\n` +
            `• **Top:** ${outfitRes.pieces[0].brand} - ${outfitRes.pieces[0].name} (Size: \`${outfitRes.pieces[0].selectedSize}\`)\n` +
            `• **Bottom:** ${outfitRes.pieces[1].brand} - ${outfitRes.pieces[1].name} (Size: \`${outfitRes.pieces[1].selectedSize}\`)\n` +
            `• **Footwear:** ${outfitRes.pieces[2].brand} - ${outfitRes.pieces[2].name} (Size: \`${outfitRes.pieces[2].selectedSize}\`)\n` +
            `• **Accessory:** ${outfitRes.pieces[3].brand} - ${outfitRes.pieces[3].name} (Size: \`${outfitRes.pieces[3].selectedSize}\`)\n\n` +
            `🏷️ **Subtotal:** $${summary.subtotal} | **Promo Savings (FASHION20):** -$${summary.discountAmount} (20% OFF)\n` +
            `🚚 **Final Total (Free Shipping):** **$${summary.total}** *(Budget Left: $${summary.remainingBudget})*`
    });
  }

  // --- SCENARIO 2: Dynamic Athletic Set ---
  async executeDynamicAthletic() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "Generate a high-performance activewear set with premium running shoes, workout top, and joggers matching my profile. Apply the sneaker promo code."
    });

    await this.sleep(700);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: "🧠 **Performance Stylist Plan:**\n1. Query dynamic generator for `athletic` style with high rating priority (On Running / Nike / Lululemon).\n2. Load pieces matching user's stored athletic sizes.\n3. Apply `FASHION20` discount."
    });

    await this.sleep(800);

    this.emit("TOOL_CALL", { tool: "generateDynamicOutfit", args: { style: "athletic", occasion: "Marathon & Gym Training", maxBudget: 450 } });
    await this.sleep(900);
    const outfitRes = await webMCP.executeTool("generateDynamicOutfit", { style: "athletic", occasion: "Marathon & Gym Training", maxBudget: 450 });
    this.emit("TOOL_RESULT", { tool: "generateDynamicOutfit", result: outfitRes });

    await this.sleep(600);

    this.emit("TOOL_CALL", { tool: "addDynamicOutfitToCart", args: { style: "athletic", occasion: "Marathon & Gym Training" } });
    await this.sleep(800);
    await webMCP.executeTool("addDynamicOutfitToCart", { style: "athletic", occasion: "Marathon & Gym Training" });

    await this.sleep(600);

    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "FASHION20" } });
    await this.sleep(700);
    await webMCP.executeTool("applyPromoCode", { code: "FASHION20" });

    await this.sleep(500);

    const summary = store.getCartSummary();

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "final",
      text: `🏃‍♂️ **High-Performance Athletic Kit Ready!**\n\n` +
            `• **Running Shoes:** ${outfitRes.pieces[2].brand} - ${outfitRes.pieces[2].name} (${outfitRes.pieces[2].selectedSize})\n` +
            `• **Workout Top:** ${outfitRes.pieces[0].brand} - ${outfitRes.pieces[0].name} (${outfitRes.pieces[0].selectedSize})\n` +
            `• **Pants:** ${outfitRes.pieces[1].brand} - ${outfitRes.pieces[1].name} (${outfitRes.pieces[1].selectedSize})\n` +
            `• **Accessory:** ${outfitRes.pieces[3].brand} - ${outfitRes.pieces[3].name}\n\n` +
            `💰 **Total Cost:** **$${summary.total}** after 20% discount (-$${summary.discountAmount}).`
    });
  }

  // --- SCENARIO 3: Dynamic Streetwear & Human Checkout ---
  async executeDynamicStreetwear() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "Style an urban streetwear outfit with heavy hoodie, selvedge denim, retro sneakers, and an accessory under $350. Apply coupon and initiate human-authorized checkout."
    });

    await this.sleep(700);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: "🧠 **Safety-First Streetwear Stylist:**\n1. Clear previous cart.\n2. Generate fresh `streetwear` combination (Nike, Levi's, Carhartt, Adidas, Vans).\n3. Apply `FASHION20` coupon.\n4. Call `requestCheckoutApproval` to invoke the **Human-in-the-Loop Security Guardrail**."
    });

    await this.sleep(800);

    store.clearCart();

    this.emit("TOOL_CALL", { tool: "generateDynamicOutfit", args: { style: "streetwear", occasion: "Urban Weekend", maxBudget: 350 } });
    await this.sleep(900);
    const outfitRes = await webMCP.executeTool("generateDynamicOutfit", { style: "streetwear", occasion: "Urban Weekend", maxBudget: 350 });
    this.emit("TOOL_RESULT", { tool: "generateDynamicOutfit", result: outfitRes });

    await this.sleep(600);

    this.emit("TOOL_CALL", { tool: "addDynamicOutfitToCart", args: { style: "streetwear" } });
    await this.sleep(700);
    await webMCP.executeTool("addDynamicOutfitToCart", { style: "streetwear" });

    await this.sleep(500);

    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "FASHION20" } });
    await this.sleep(600);
    await webMCP.executeTool("applyPromoCode", { code: "FASHION20" });

    await this.sleep(500);

    // Request Approval
    this.emit("TOOL_CALL", {
      tool: "requestCheckoutApproval",
      args: {
        deliveryAddress: "Penthouse 4B, 500 Howard St, San Francisco, CA 94105",
        deliverySlot: "Express 2-Day Courier Delivery",
        paymentMethod: "Apple Pay"
      }
    });

    await this.sleep(900);

    const approvalRes = await webMCP.executeTool("requestCheckoutApproval", {
      deliveryAddress: "Penthouse 4B, 500 Howard St, San Francisco, CA 94105",
      deliverySlot: "Express 2-Day Courier Delivery",
      paymentMethod: "Apple Pay"
    });

    this.emit("TOOL_RESULT", { tool: "requestCheckoutApproval", result: approvalRes });

    await this.sleep(600);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "approval_prompt",
      text: `🛡️ **Human Authorization Required (Safety Guardrail)**\n\n` +
            `I have assembled a unique multi-brand streetwear look within your budget ceiling:\n` +
            `• **Ensemble:** ${outfitRes.pieces.map(p => `${p.brand} ${p.name}`).join(" + ")}\n` +
            `• **Total Authorized Amount:** **$${approvalRes.orderSummary.total}** *(Under budget by $${approvalRes.orderSummary.remainingBudget})*\n` +
            `• **Security Authorization Token:** \`${approvalRes.approvalToken}\`\n\n` +
            `👉 **Please review the on-screen Checkout Security Modal and click 'Authorize & Place Order' to confirm!**`
    });
  }

  // --- NATURAL LANGUAGE USER CHAT HANDLER ---
  async handleUserMessage(userText) {
    if (!userText.trim() || this.isBusy) return;
    this.isBusy = true;
    this.emit("STATUS_CHANGE", { isBusy: true });

    this.emit("AGENT_MESSAGE", { role: "user", text: userText });
    await this.sleep(500);

    try {
      const lower = userText.toLowerCase();

      // Memory check or size update
      if (lower.includes("my size") || lower.includes("memory") || lower.includes("preferences") || lower.includes("profile")) {
        this.emit("TOOL_CALL", { tool: "getUserStyleMemory", args: {} });
        await this.sleep(500);
        const res = await webMCP.executeTool("getUserStyleMemory", {});
        this.emit("TOOL_RESULT", { tool: "getUserStyleMemory", result: res });
        await this.sleep(400);

        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "final",
          text: `🧠 **Your Saved Wardrobe Memory Profile:**\n\n` +
                `• **Shoe Size:** \`${res.savedSizes.shoes}\`\n` +
                `• **Top / Shirt Size:** \`${res.savedSizes.tops}\`\n` +
                `• **Pants / Denim Size:** \`${res.savedSizes.bottoms}\`\n` +
                `• **Belt Size:** \`${res.savedSizes.accessories}\`\n` +
                `• **Favorite Brands:** ${res.favoriteBrands.join(", ") || "Nike, Levi's, Ralph Lauren"}\n\n` +
                `I automatically use these sizes whenever generating outfits for you!`
        });
        return;
      }

      // Generate outfit
      if (lower.includes("outfit") || lower.includes("look") || lower.includes("style me") || lower.includes("combine") || lower.includes("recommend")) {
        const style = lower.includes("street") ? "streetwear" : lower.includes("athletic") || lower.includes("gym") || lower.includes("running") ? "athletic" : lower.includes("formal") ? "formal" : "smart_casual";
        
        let preferredBrand = null;
        for (const brand of ["Nike", "Adidas", "Levi's", "Ralph Lauren", "Zara", "Patagonia", "Fossil", "Timberland", "Lululemon"]) {
          if (lower.includes(brand.toLowerCase())) {
            preferredBrand = brand;
            break;
          }
        }

        this.emit("TOOL_CALL", { tool: "generateDynamicOutfit", args: { style, preferredBrand } });
        await this.sleep(700);
        const outfit = await webMCP.executeTool("generateDynamicOutfit", { style, preferredBrand });
        this.emit("TOOL_RESULT", { tool: "generateDynamicOutfit", result: outfit });
        await this.sleep(500);

        this.emit("TOOL_CALL", { tool: "addDynamicOutfitToCart", args: { style, preferredBrand } });
        await this.sleep(700);
        await webMCP.executeTool("addDynamicOutfitToCart", { style, preferredBrand });

        const summary = store.getCartSummary();

        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "final",
          text: `✨ I dynamically styled a unique **${outfit.style.replace('_', ' ').toUpperCase()}** combination for you:\n\n` +
                `1. **${outfit.pieces[0].brand}** - ${outfit.pieces[0].name} (Size: \`${outfit.pieces[0].selectedSize}\`)\n` +
                `2. **${outfit.pieces[1].brand}** - ${outfit.pieces[1].name} (Size: \`${outfit.pieces[1].selectedSize}\`)\n` +
                `3. **${outfit.pieces[2].brand}** - ${outfit.pieces[2].name} (Size: \`${outfit.pieces[2].selectedSize}\`)\n` +
                `4. **${outfit.pieces[3].brand}** - ${outfit.pieces[3].name} (Size: \`${outfit.pieces[3].selectedSize}\`)\n\n` +
                `All 4 pieces have been added to your cart with your saved sizes. Total is **$${summary.total}**.`
        });
        return;
      }

      // Clear cart
      if (lower.includes("clear") && lower.includes("cart")) {
        store.clearCart();
        this.emit("AGENT_MESSAGE", { role: "agent", type: "final", text: "🛍️ I've emptied your wardrobe cart." });
        return;
      }

      // Promo Code
      if (lower.includes("promo") || lower.includes("coupon") || lower.includes("discount") || lower.includes("fashion20")) {
        const code = lower.includes("sneaker") ? "SNEAKER10" : "FASHION20";
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

      // Checkout
      if (lower.includes("checkout") || lower.includes("place order") || lower.includes("buy")) {
        this.emit("TOOL_CALL", { tool: "requestCheckoutApproval", args: { deliveryAddress: "User Home Address" } });
        await this.sleep(700);
        const res = await webMCP.executeTool("requestCheckoutApproval", { deliveryAddress: "User Home Address" });
        this.emit("TOOL_RESULT", { tool: "requestCheckoutApproval", result: res });
        await this.sleep(400);

        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "approval_prompt",
          text: `🛡️ **Checkout Authorization Triggered**\nTotal: **$${res.orderSummary.total}**. Please click 'Authorize Order' in the modal on your screen.`
        });
        return;
      }

      // General Search
      this.emit("TOOL_CALL", { tool: "searchCatalog", args: { query: userText } });
      await this.sleep(600);
      const searchRes = await webMCP.executeTool("searchCatalog", { query: userText });
      this.emit("TOOL_RESULT", { tool: "searchCatalog", result: searchRes });
      await this.sleep(400);

      if (searchRes.matchCount > 0) {
        const first = searchRes.products[0];
        const size = first.sizes ? first.sizes[0] : "Standard";
        this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: first.id, quantity: 1, size } });
        await this.sleep(500);
        await webMCP.executeTool("addToCart", { productId: first.id, quantity: 1, size });

        const cart = store.getCartSummary();
        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "final",
          text: `🛍️ Found **${first.brand} ${first.name}** ($${first.price.toFixed(2)}, Size: ${size}) and added it to your wardrobe cart.\n\n` +
                `Cart Total is now **$${cart.total}** (${cart.totalItems} items).`
        });
      } else {
        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "final",
          text: `I searched our 44+ product collection for "${userText}", but couldn't find an exact match. Try asking: "Style a casual look with Nike sneakers and Levi's jeans" or search for brands like Ralph Lauren, Adidas, Fossil, or Zara!`
        });
      }

    } catch (err) {
      console.error("Agent error:", err);
      this.emit("AGENT_MESSAGE", { role: "agent", type: "error", text: `⚠️ Error: ${err.message}` });
    } finally {
      this.isBusy = false;
      this.emit("STATUS_CHANGE", { isBusy: false });
    }
  }
}

export const agentEngine = new FashionAgentEngine();
