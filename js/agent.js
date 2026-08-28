/**
 * SmartCart AI - Fashion & Footwear Agent Reasoning Engine
 * 1-Click autonomous styling scenarios and natural language fashion concierge
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
        id: "scenario-smart-casual",
        title: "Smart Casual Date Night Outfit",
        badge: "Stylist & Outfit Assembler",
        prompt: "Coordinate a sharp smart-casual evening outfit with a tailored linen shirt, stretch chinos, handcrafted leather Chelsea boots, and a matching leather belt. Apply the 20% fashion coupon and verify total budget.",
        icon: "suit"
      },
      {
        id: "scenario-athletic-running",
        title: "High-Performance Running & Gym Set",
        badge: "Sneakers & Activewear Set",
        prompt: "Assemble a high-performance running set featuring the Apex CloudRunner Pro sneakers, seamless athletic training top, and compression leggings. Apply footwear discount and summarize savings.",
        icon: "running"
      },
      {
        id: "scenario-streetwear-checkout",
        title: "Autonomous Streetwear & Human Checkout",
        badge: "Safety Guardrail Demo",
        prompt: "Build an urban minimalist streetwear look under $250 with our heavyweight hoodie, selvedge denim, white leather court sneakers, and retro sunglasses. Optimize coupons and trigger the human approval checkout modal.",
        icon: "shield"
      }
    ];
  }

  async runScenario(scenarioId) {
    if (this.isBusy) return;
    this.isBusy = true;
    this.emit("STATUS_CHANGE", { isBusy: true });

    try {
      if (scenarioId === "scenario-smart-casual") {
        await this.executeSmartCasualScenario();
      } else if (scenarioId === "scenario-athletic-running") {
        await this.executeAthleticRunningScenario();
      } else if (scenarioId === "scenario-streetwear-checkout") {
        await this.executeStreetwearCheckoutScenario();
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

  // --- SCENARIO 1: Smart Casual Date Night Outfit ---
  async executeSmartCasualScenario() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "Coordinate a sharp smart-casual evening outfit with a tailored linen shirt, stretch chinos, handcrafted leather Chelsea boots, and a matching leather belt. Apply the 20% fashion coupon and verify total budget."
    });

    await this.sleep(700);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: "🧠 **Stylist Plan:**\n1. Query WebMCP for curated lookbook matching `style: 'Smart Casual'`.\n2. Add the complete 4-piece outfit (Linen shirt, Chinos, Chelsea boots, Belt) to cart with matched sizes.\n3. Apply promo code `FASHION20`.\n4. Calculate savings and price breakdown."
    });

    await this.sleep(900);

    // Step 1: getOutfitSuggestions
    this.emit("TOOL_CALL", { tool: "getOutfitSuggestions", args: { style: "Smart Casual", maxBudget: 350 } });
    await this.sleep(800);
    const outfitRes = await webMCP.executeTool("getOutfitSuggestions", { style: "Smart Casual", maxBudget: 350 });
    this.emit("TOOL_RESULT", { tool: "getOutfitSuggestions", result: outfitRes });

    await this.sleep(700);

    const chosenOutfit = outfitRes.outfits[0];
    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: `✨ Selected **${chosenOutfit.name}** (4 coordinated pieces, Est. $${chosenOutfit.estimatedCost}). Now auto-assembling into wardrobe cart with size matching.`
    });

    await this.sleep(600);

    // Step 2: addOutfitToCart
    this.emit("TOOL_CALL", { tool: "addOutfitToCart", args: { outfitId: "outfit-02", shoeSize: "US 10", clothingSize: "M" } });
    await this.sleep(900);
    const addOutfitRes = await webMCP.executeTool("addOutfitToCart", { outfitId: "outfit-02", shoeSize: "US 10", clothingSize: "M" });
    this.emit("TOOL_RESULT", { tool: "addOutfitToCart", result: addOutfitRes });

    await this.sleep(700);

    // Step 3: Apply Promo Code FASHION20
    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "FASHION20" } });
    await this.sleep(800);
    const promoRes = await webMCP.executeTool("applyPromoCode", { code: "FASHION20" });
    this.emit("TOOL_RESULT", { tool: "applyPromoCode", result: promoRes });

    await this.sleep(600);

    const summary = store.getCartSummary();

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "final",
      text: `👔 **Smart Casual Look Assembled Perfectly!**\n\n` +
            `• **Lookbook Set:** *${chosenOutfit.name}*\n` +
            `• **Pieces Included:** Tailored Linen Shirt (Size M), Stretch Chinos (32x32), Heritage Chelsea Boots (US 10), Tuscan Leather Belt (34)\n` +
            `• **Original Subtotal:** $${summary.subtotal}\n` +
            `• **Fashion VIP Savings (FASHION20):** -$${summary.discountAmount} (20% OFF)\n` +
            `• **Final Total (Free Courier Delivery):** **$${summary.total}** *(Budget Left: $${summary.remainingBudget})*\n\n` +
            `Would you like me to trigger express checkout for you?`
    });
  }

  // --- SCENARIO 2: High-Performance Running & Gym Set ---
  async executeAthleticRunningScenario() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "Assemble a high-performance running set featuring the Apex CloudRunner Pro sneakers, seamless athletic training top, and compression leggings. Apply footwear discount and summarize savings."
    });

    await this.sleep(700);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: "🧠 **Performance Agent Plan:**\n1. Filter catalog for `athletic` activewear and performance footwear.\n2. Add Apex CloudRunner Pro Sneakers (Size US 9, Crimson Red).\n3. Add Pro-Breathe Training Top & Sculpt Compression Leggings.\n4. Apply promo code `FASHION20`.\n5. Verify fit and total order cost."
    });

    await this.sleep(800);

    // Step 1: Filter
    this.emit("TOOL_CALL", { tool: "filterCatalog", args: { category: "activewear", styles: ["athletic"] } });
    await this.sleep(700);
    await webMCP.executeTool("filterCatalog", { category: "activewear", styles: ["athletic"] });

    await this.sleep(500);

    // Step 2: Add Sneakers
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "shoe-01", quantity: 1, size: "US 9", color: "Crimson Red" } });
    await this.sleep(600);
    await webMCP.executeTool("addToCart", { productId: "shoe-01", quantity: 1, size: "US 9", color: "Crimson Red" });

    // Step 3: Add Top
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "top-05", quantity: 1, size: "M", color: "Electric Cyan" } });
    await this.sleep(600);
    await webMCP.executeTool("addToCart", { productId: "top-05", quantity: 1, size: "M", color: "Electric Cyan" });

    // Step 4: Add Leggings
    this.emit("TOOL_CALL", { tool: "addToCart", args: { productId: "bottom-03", quantity: 1, size: "M", color: "Matte Black" } });
    await this.sleep(600);
    await webMCP.executeTool("addToCart", { productId: "bottom-03", quantity: 1, size: "M", color: "Matte Black" });

    await this.sleep(600);

    // Step 5: Apply Promo
    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "FASHION20" } });
    await this.sleep(700);
    const promoRes = await webMCP.executeTool("applyPromoCode", { code: "FASHION20" });
    this.emit("TOOL_RESULT", { tool: "applyPromoCode", result: promoRes });

    await this.sleep(600);

    const summary = store.getCartSummary();

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "final",
      text: `🏃‍♂️ **Performance Running Set Ready!**\n\n` +
            `• **Apex CloudRunner Pro Sneakers:** Size US 9 (Crimson Red)\n` +
            `• **Pro-Breathe Training Top:** Size M (Electric Cyan)\n` +
            `• **Sculpt Compression Leggings:** Size M (Matte Black)\n` +
            `• **Total Price:** **$${summary.total}** after -$${summary.discountAmount} discount (20% OFF)\n` +
            `• **Free Shipping Qualified!**`
    });
  }

  // --- SCENARIO 3: Budget Streetwear Look + Human Checkout Guardrail ---
  async executeStreetwearCheckoutScenario() {
    this.emit("AGENT_MESSAGE", {
      role: "user",
      text: "Build an urban minimalist streetwear look under $250 with our heavyweight hoodie, selvedge denim, white leather court sneakers, and retro sunglasses. Optimize coupons and trigger the human approval checkout modal."
    });

    await this.sleep(700);

    this.emit("AGENT_MESSAGE", {
      role: "agent",
      type: "thought",
      text: "🧠 **Safety-First Stylist Plan:**\n1. Clear existing wardrobe cart.\n2. Set budget limit to $250.00.\n3. Add lookbook set `outfit-01` (Hoodie, Selvedge Denim, White Leather Court Sneakers, Sunglasses).\n4. Apply `FASHION20` discount.\n5. Call `requestCheckoutApproval` to invoke the **Human-in-the-Loop Security Guardrail**."
    });

    await this.sleep(800);

    store.clearCart();
    store.setBudgetLimit(250.00);

    // Add Lookbook 1
    this.emit("TOOL_CALL", { tool: "addOutfitToCart", args: { outfitId: "outfit-01", shoeSize: "US 10", clothingSize: "L" } });
    await this.sleep(900);
    await webMCP.executeTool("addOutfitToCart", { outfitId: "outfit-01", shoeSize: "US 10", clothingSize: "L" });

    await this.sleep(600);

    // Apply Coupon
    this.emit("TOOL_CALL", { tool: "applyPromoCode", args: { code: "FASHION20" } });
    await this.sleep(700);
    await webMCP.executeTool("applyPromoCode", { code: "FASHION20" });

    await this.sleep(600);

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
            `I have assembled your 4-piece streetwear look within your budget ceiling:\n` +
            `• **Complete Set:** Heavyweight Hoodie (L), Selvedge Jeans (32x32), White Court Sneakers (US 10), Retro Sunglasses\n` +
            `• **Total Authorized Cost:** **$${approvalRes.orderSummary.total}** *(Under budget by $${approvalRes.orderSummary.remainingBudget})*\n` +
            `• **Destination:** Penthouse 4B, 500 Howard St, San Francisco, CA\n` +
            `• **Security Token:** \`${approvalRes.approvalToken}\`\n\n` +
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

      // Clear cart
      if (lower.includes("clear") && lower.includes("cart")) {
        store.clearCart();
        this.emit("AGENT_MESSAGE", { role: "agent", type: "final", text: "🛍️ I've cleared your wardrobe shopping cart." });
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
        this.emit("TOOL_CALL", { tool: "requestCheckoutApproval", args: { deliveryAddress: "User Home Address", paymentMethod: "Credit Card" } });
        await this.sleep(700);
        const res = await webMCP.executeTool("requestCheckoutApproval", { deliveryAddress: "User Home Address", paymentMethod: "Credit Card" });
        this.emit("TOOL_RESULT", { tool: "requestCheckoutApproval", result: res });
        await this.sleep(400);

        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "approval_prompt",
          text: `🛡️ **Checkout Authorization Triggered**\nTotal: **$${res.orderSummary.total}**. Please click 'Authorize Order' in the modal on your screen.`
        });
        return;
      }

      // Outfit suggestions
      if (lower.includes("outfit") || lower.includes("look") || lower.includes("style")) {
        const style = lower.includes("street") ? "Streetwear" : lower.includes("athletic") || lower.includes("running") ? "Athletic" : "Smart Casual";
        this.emit("TOOL_CALL", { tool: "getOutfitSuggestions", args: { style, maxBudget: 350 } });
        await this.sleep(600);
        const res = await webMCP.executeTool("getOutfitSuggestions", { style, maxBudget: 350 });
        this.emit("TOOL_RESULT", { tool: "getOutfitSuggestions", result: res });
        await this.sleep(400);

        if (res.outfits.length > 0) {
          const top = res.outfits[0];
          this.emit("AGENT_MESSAGE", {
            role: "agent",
            type: "final",
            text: `✨ I styled **${top.name}** (${top.style}, ${top.piecesCount} coordinated pieces, Est. $${top.estimatedCost}).\n\n` +
                  `${top.description}\n\n` +
                  `Would you like me to add this full look to your cart?`
          });
        }
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
          text: `🛍️ Found **${first.name}** ($${first.price.toFixed(2)}, Size: ${size}) and added it to your wardrobe cart.\n\n` +
                `Cart Total is now **$${cart.total}** (${cart.totalItems} items).`
        });
      } else {
        this.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "final",
          text: `I searched our fashion collection for "${userText}", but couldn't find an exact match. Try searching for sneakers, boots, denim, hoodies, or linen shirts!`
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
