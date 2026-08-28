# 👔 SmartCart Fashion AI — Agent-Native Clothes, Shoes & Outfit Concierge
### Built for the WebMCP Challenge Hackathon

> **SmartCart Fashion AI** showcases the future of agent-native e-commerce using the open **WebMCP (Web Model Context Protocol)** standard. Instead of AI agents scraping messy web pages or guessing button coordinates, SmartCart Fashion AI exposes structured fashion styling tools via `document.modelContext`, enabling automated head-to-toe outfit coordination, size/color matching, budget optimization, and human-in-the-loop checkout security.

---

## 🌟 Key Highlights & Hackathon Winning Features

1. **Full WebMCP Standard Compliance (`document.modelContext`)**:
   - 11 structured fashion tools exposed directly in the browser environment with strict JSON schemas.
   - Any WebMCP-compatible browser (e.g. ChatGPT desktop browser, WebMCP extensions) or local runtime can inspect and invoke tools natively.

2. **Complete Wardrobe & Footwear Catalog**:
   - 16+ designer fashion items across **Footwear & Sneakers**, **Tops & Jackets**, **Pants & Denim**, **Activewear**, and **Accessories**.
   - Attributes include Sizes (`US 8-12`, `S-XXL`), Colors, Materials (French Flax Linen, Full-Grain Italian Leather, Selvedge Denim), and Style aesthetics (`Streetwear`, `Smart Casual`, `Athletic`, `Sustainable`, `Formal`).

3. **Curated Lookbook Studio (1-Click Head-to-Toe Outfit Assembly)**:
   - *Minimalist Urban Streetwear Set* (Heavyweight Hoodie, Selvedge Denim, White Court Sneakers, Polarized Sunglasses).
   - *Smart Casual Business & Date Night Look* (Tailored Linen Shirt, Stretch Chinos, Handcrafted Chelsea Boots, Leather Belt).
   - *High-Performance Athletic Running Set* (Apex CloudRunner Pro Sneakers, Seamless Training Top, Sculpt Leggings).
   - *Vintage Denim & Chrono Weekend Kit* (Vintage Denim Trucker Jacket, Essential Tee, Cargo Pants, Chronograph Watch).

4. **WebMCP Live Inspector & Telemetry DevTools**:
   - Real-time telemetry inspector drawer displaying tool names, arguments, return payloads, execution latency (in milliseconds), and 1-click JSON schema manifest export.

5. **Human-in-the-Loop Safety Guardrails**:
   - The AI agent cannot charge a credit card autonomously. It executes `requestCheckoutApproval`, triggering a secure on-screen authorization modal requiring explicit human confirmation.

---

## 🛠️ WebMCP Tools Specification

SmartCart Fashion AI exposes the following tools on `document.modelContext` / `window.modelContext`:

| Tool Name | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `searchCatalog` | Search clothes, sneakers, and accessories with style/size filters | `query`, `category`, `maxPrice`, `styles` |
| `filterCatalog` | Update active storefront view & style sorting | `category`, `maxPrice`, `styles`, `sortBy` |
| `getOutfitSuggestions` | Retrieve curated outfit lookbooks matching style and budget | `style`, `occasion`, `maxBudget` |
| `addOutfitToCart` | Auto-resolves and adds all coordinated pieces of an outfit to cart | `outfitId`, `shoeSize`, `clothingSize` |
| `addToCart` | Adds a specific apparel item with size and color options | `productId`, `quantity`, `size`, `color` |
| `updateCartQuantity` | Updates item quantity or removes if 0 | `cartIndex`, `quantity` |
| `removeFromCart` | Removes item from active wardrobe cart | `cartIndex` |
| `applyPromoCode` | Applies fashion coupons (`FASHION20`, `SNEAKER10`, `FREESHIP`) | `code` |
| `getCartSummary` | Returns full cart line items, sizes, delivery fee, taxes, and balance | *(None)* |
| `requestCheckoutApproval` | **Safety Guardrail**: Prepares order & requests human approval | `deliveryAddress`, `deliverySlot`, `paymentMethod` |
| `confirmOrder` | Finalizes order using human authorization token | `approvalToken` |

---

## 🚀 How to Run Locally

SmartCart Fashion AI runs with standard ES6 modules and Vanilla CSS with **zero dependencies**.

```bash
# Navigate to the project directory
cd smartcart-ai

# Start a lightweight local server
npx -y serve .
```
Then open `http://localhost:3000` in your browser.

---

## 🎬 Video Demo Pitch Script (2 Minutes)

* **0:00 - 0:25 (The Problem):**
  > *"When AI agents try to shop for clothes online today, they struggle with size drop-downs, color pickers, and coordinate guessing. WebMCP fixes this by giving websites a direct, structured tool API under `document.modelContext`."*

* **0:25 - 0:50 (Introducing SmartCart Fashion AI):**
  > *"Meet SmartCart Fashion AI—the agent-native wardrobe stylist. The site exposes 11 WebMCP tools covering footwear, apparel, accessories, and curated outfit lookbooks."*

* **0:50 - 1:25 (Live Autonomous Styling Demo):**
  > *"Let's click 'Smart Casual Date Night Outfit'. Watch the agent query `getOutfitSuggestions`, resolve all 4 coordinated pieces (Linen shirt, Chinos, Chelsea boots, and Leather belt) with size matching, apply promo code `FASHION20` for 20% off, and update our wardrobe cart live on screen!"*

* **1:25 - 1:45 (WebMCP Inspector & Human-in-the-Loop):**
  > *"Judges can open the WebMCP Live Inspector to see raw JSON inputs, outputs, and sub-15ms execution logs. And notice our safety guardrail: the agent invokes `requestCheckoutApproval`, presenting a security modal for explicit human authorization."*

* **1:45 - 2:00 (Conclusion):**
  > *"SmartCart Fashion AI proves how WebMCP revolutionizes fashion e-commerce for both AI agents and human shoppers. Thank you!"*

---
*Built with ❤️ for the WebMCP Challenge.*
