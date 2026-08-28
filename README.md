# 🛒 SmartCart AI — Agent-Native Supermarket & Recipe Optimizer
### Built for the WebMCP Challenge Hackathon

> **SmartCart AI** demonstrates the future of the agentic web using the open **WebMCP (Web Model Context Protocol)** standard. Instead of AI agents guessing button coordinates or scraping DOM trees, SmartCart AI exposes structured tools via `document.modelContext`, enabling intelligent shopping, recipe ingredient resolution, nutritional optimization, budget guardrails, and human-in-the-loop checkout security.

---

## 🌟 Key Highlights & Hackathon Winning Features

1. **Full WebMCP Standard Compliance (`document.modelContext`)**:
   - 12 structured tools exposed directly in the browser environment with strict JSON schemas.
   - Any WebMCP-compatible browser (e.g. ChatGPT desktop browser, WebMCP extensions) or local runtime can discover and execute tools natively.

2. **Dual-Interface Reactive Architecture**:
   - Seamlessly synchronizes human interactions (browsing catalog, scaling recipes, adjusting quantities) with autonomous AI agent actions.
   - **Real-Time Visual Highlight Glows**: As the AI agent reasons and invokes tools, affected cards and drawers pulse on screen.

3. **WebMCP Live Inspector & Telemetry DevTools**:
   - Built-in live telemetry inspector drawer displaying tool names, arguments, return payloads, execution latency (in milliseconds), and 1-click JSON schema manifest export.

4. **Interactive 1-Click Autonomous Demo Scenarios**:
   - **Scenario 1: Gluten-Free Italian Dinner for 4 under $40** (Recipe search, ingredient auto-carting, beverage pairing, `WEBMCP20` coupon optimization, nutrition check).
   - **Scenario 2: High-Protein Keto Meal Prep** (Macro-targeted filtering, protein density calculation, `HEALTHY10` coupon).
   - **Scenario 3: Budget Guardrails & Human-in-the-Loop Checkout** (Autonomous pantry assembly under $30 + cryptographic approval token modal).

5. **Human-in-the-Loop Safety Guardrails**:
   - Agent cannot finalize financial transactions autonomously. It executes `requestCheckoutApproval`, triggering a secure on-screen authorization prompt requiring explicit user confirmation.

---

## 🛠️ WebMCP Tools Specification

SmartCart AI exposes the following tools on `document.modelContext` / `window.modelContext`:

| Tool Name | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `searchCatalog` | Search grocery catalog with keywords and price/dietary filters | `query`, `category`, `maxPrice`, `dietary` |
| `filterCatalog` | Update active storefront view & sort order | `category`, `maxPrice`, `dietaryPreferences`, `sortBy` |
| `getRecipeSuggestions` | Retrieve curated chef meals matching dietary & budget caps | `dietary`, `maxBudget`, `servings` |
| `addRecipeIngredientsToCart` | Auto-resolves and adds all recipe ingredients to cart | `recipeId`, `servings`, `preferOrganic` |
| `addToCart` | Adds a specific grocery item and quantity | `productId`, `quantity` |
| `updateCartQuantity` | Updates item quantity or removes if 0 | `productId`, `quantity` |
| `removeFromCart` | Removes item from active cart | `productId` |
| `applyPromoCode` | Applies coupons (`WEBMCP20`, `HEALTHY10`, `FREESHIP`) | `code` |
| `getNutritionSummary` | Aggregates Calories, Protein, Carbs, Fats, and Fiber | *(None)* |
| `getCartSummary` | Returns full cart line items, taxes, fees, and balance | *(None)* |
| `requestCheckoutApproval` | **Safety Guardrail**: Prepares order & requests human approval | `deliveryAddress`, `deliverySlot`, `paymentMethod` |
| `confirmOrder` | Finalizes order using human authorization token | `approvalToken` |

---

## 🚀 How to Run Locally

SmartCart AI is built with modern standard ES6 modules and Vanilla CSS. It has **zero heavy dependencies** and runs instantly.

### Option 1: Using Node / npx (Recommended)
```bash
# Navigate to the project directory
cd smartcart-ai

# Start a lightweight local static server
npx -y serve .
```
Then open `http://localhost:3000` in your browser.

### Option 2: Using Python
```bash
cd smartcart-ai
python -m http.server 8000
```
Open `http://localhost:8000`.

### Option 3: Using VS Code / Antigravity Live Server
Right-click `index.html` and select **Open with Live Server**.

---

## 🌐 Deploy to Production (1-Click)

### Deploy to Netlify / Vercel:
1. Push the `smartcart-ai` folder to GitHub.
2. Link your repository on [Netlify](https://www.netlify.com) or [Vercel](https://vercel.com).
3. Set Publish Directory to `./` (root).
4. Done! Your WebMCP app is live worldwide with full HTTPS support.

---

## 🎬 Hackathon Pitch & Video Demo Script (2 Minutes)

Use this script when recording your submission video or presenting to the judges:

* **0:00 - 0:20 (The Problem):**
  > *"Today's AI web agents rely on slow, brittle computer vision and DOM scraping. If a button moves, the agent breaks. WebMCP solves this by allowing websites to expose clean, structured tool APIs directly to AI models."*

* **0:20 - 0:50 (Introducing SmartCart AI):**
  > *"Meet SmartCart AI — the world's first agent-native supermarket and recipe concierge built on WebMCP. Notice how the page exposes 12 structured tools under `document.modelContext`. Now let's watch the agent in action with 1 click."*

* **0:50 - 1:20 (Live Scenario Execution):**
  > *"When we click 'Gluten-Free Italian Dinner for 4', the agent reasons in real time: it queries `getRecipeSuggestions`, discovers the Tuscan Pesto Penne, automatically executes `addRecipeIngredientsToCart`, finds a beverage, and calls `applyPromoCode('WEBMCP20')` to save 20%—all while the UI pulses and updates live without any page reloads."*

* **1:20 - 1:40 (WebMCP Inspector & Safety):**
  > *"Judges can open the WebMCP Live Inspector drawer to view raw JSON inputs, outputs, and millisecond execution telemetry. Notice our Human-in-the-Loop guardrail: when the agent is ready to checkout, it executes `requestCheckoutApproval`, presenting a cryptographic authorization token for human verification."*

* **1:40 - 2:00 (Conclusion):**
  > *"SmartCart AI showcases how WebMCP transforms traditional websites into high-speed, reliable, agentic powerhouses. Thank you!"*

---

## ⚖️ Hackathon Judging Criteria Alignment

| Criteria | Implementation in SmartCart AI |
| :--- | :--- |
| **WebMCP Standard Utilization** | Full `document.modelContext` exposure with complete JSON schemas, input validation, and execution handlers. |
| **User Experience & Wow Factor** | Glassmorphic dark aesthetic, dynamic `@keyframes agentPulseGlow`, real-time macro meter, and 1-click demo scenarios. |
| **Safety & Security** | Human-in-the-Loop checkout guardrail with token-based authorization. |
| **Completeness & Polish** | 30+ products, 4 chef recipes, 3 coupons, live inspector, search, filter, and zero broken links. |

---
*Built with ❤️ for the WebMCP Challenge.*
