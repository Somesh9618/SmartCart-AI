# 👔 SmartCart Fashion AI — Multi-Brand Clothes, Shoes & Dynamic Outfit Concierge
### Built for the WebMCP Challenge Hackathon

> **SmartCart Fashion AI** is an agent-native multi-brand fashion concierge featuring **44+ products across global brands** (Nike, Ralph Lauren, Levi's, Adidas, Fossil, Timberland, Zara, Patagonia, Lululemon), **dynamic unique outfit generation**, and **persistent User Wardrobe Memory** built on the open **WebMCP standard** (`document.modelContext`).

---

## 🌟 Key Highlights & Hackathon Features

1. **Massive 44+ Multi-Brand Catalog**:
   - **11 Shirts & Tops:** Ralph Lauren Oxford, Nike Club Hoodie, Zara Linen Shirt, Levi's Trucker Jacket, Uniqlo Supima Tee, Patagonia Better Sweater, Tommy Hilfiger Polo, Carhartt WIP Tee, Lululemon Workout Top, Calvin Klein Dress Shirt, H&M Linen Overshirt.
   - **11 Jeans & Pants:** Levi's 501 Selvedge, Lululemon ABC Trouser, Wrangler Retro Jeans, Dockers Chinos, Diesel D-Strukt, Carhartt WIP Cargo, Zara Pleated Trouser, AG Luxury Denim, Uniqlo Smart Ankle, G-Star RAW 3D, Nike Tech Fleece Joggers.
   - **11 Shoes & Sneakers:** Nike Air Max 90, Adidas Samba Classic, New Balance 550, On Running Cloudmonster, Timberland 6-Inch Boots, Dr. Martens 1460, Clarks Desert Boots, Vans Old Skool, Converse Chuck 70, Heritage Chelsea Boots, Puma Palermo.
   - **11 Belts & Accessories:** Fossil Joe Jean Belt, Tommy Hilfiger Reversible Belt, Timberland Heavy Belt, Calvin Klein Formal Belt, Ray-Ban Aviators, Seiko 5 Automatic Watch, Herschel 25L Backpack, Carhartt Watch Beanie, Fossil Chronograph Watch, Montblanc Style Cardholder, Ray-Ban Clubmasters.

2. **Persistent User Wardrobe Memory for AI Agent**:
   - As users browse, select, or buy clothes and shoes, the AI Stylist automatically learns and remembers preferred sizes (e.g. `US 10`, `L`, `32x32`), favorite brands (*Nike, Levi's, Ralph Lauren*), and style affinities across website visits in `localStorage`.
   - On future visits, the AI greets returning users and tailors all outfit suggestions to their remembered preferences!

3. **Dynamic Unique Outfit Generation**:
   - The AI Stylist algorithmically constructs fresh, coordinated 4-piece combinations (Top + Bottom + Shoe + Accessory) matching aesthetic styles (`Smart Casual`, `Streetwear`, `Athletic`, `Formal`, `Sustainable`), color harmony, and budget.
   - Generates unique sets on every call with zero hardcoded repetition.

4. **WebMCP Live Inspector & Telemetry DevTools**:
   - Real-time telemetry inspector drawer displaying tool names, arguments, return payloads, execution latency (in milliseconds), and 1-click JSON schema manifest export.

5. **Human-in-the-Loop Safety Guardrails**:
   - The AI agent cannot execute financial transactions autonomously. It executes `requestCheckoutApproval`, triggering a secure on-screen authorization modal requiring explicit human confirmation.

---

## 🛠️ WebMCP Tools Specification

SmartCart Fashion AI exposes the following tools on `document.modelContext` / `window.modelContext`:

| Tool Name | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `generateDynamicOutfit` | Algorithmically creates unique 4-piece outfit matching style & memory | `style`, `occasion`, `preferredBrand`, `maxBudget` |
| `getUserStyleMemory` | Retrieves user's saved sizes, favorite brands, and past picks | *(None)* |
| `updateStyleMemory` | Updates saved sizes (shoe, top, bottom, belt) or brand preferences | `sizes`, `favoriteBrands`, `preferredStyles` |
| `searchCatalog` | Search 44+ clothes, sneakers, and accessories with brand/style filters | `query`, `brand`, `category`, `maxPrice`, `styles` |
| `filterCatalog` | Update active storefront view & brand filtering | `brand`, `category`, `maxPrice`, `styles`, `sortBy` |
| `addToCart` | Adds an item with exact size and color options | `productId`, `quantity`, `size`, `color` |
| `addDynamicOutfitToCart` | Generates a fresh outfit and adds all 4 matching pieces to cart | `style`, `occasion`, `preferredBrand` |
| `applyPromoCode` | Applies fashion coupons (`FASHION20`, `SNEAKER10`, `FREESHIP`) | `code` |
| `getCartSummary` | Returns full cart line items, sizes, delivery fee, taxes, and balance | *(None)* |
| `requestCheckoutApproval` | **Safety Guardrail**: Prepares order & requests human approval | `deliveryAddress`, `deliverySlot`, `paymentMethod` |
| `confirmOrder` | Finalizes order using human authorization token | `approvalToken` |

---

## 🚀 How to Run Locally

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
  > *"When AI agents try to shop for clothes online today, they struggle with size selection, brand matching, and coordinate guessing. WebMCP fixes this by giving websites a direct, structured tool API under `document.modelContext`."*

* **0:25 - 0:50 (Introducing SmartCart Fashion AI):**
  > *"Meet SmartCart Fashion AI—the multi-brand wardrobe concierge with 44+ products from Nike, Levi's, Ralph Lauren, Adidas, Fossil, and Zara. It features dynamic outfit generation and persistent AI wardrobe memory."*

* **0:50 - 1:25 (Live Styling & Memory Demo):**
  > *"When I open chat and ask 'Style a smart casual look with Levi's and Nike', watch the agent query `getUserStyleMemory` to recall my shoe size (US 10) and shirt size (L), run `generateDynamicOutfit` to dynamically combine a Ralph Lauren shirt, Levi's selvedge jeans, Adidas Sambas, and Fossil leather belt, apply promo code `FASHION20`, and assemble all 4 pieces live on screen!"*

* **1:25 - 1:45 (WebMCP Inspector & Human-in-the-Loop):**
  > *"Judges can open the WebMCP Live Inspector to see raw JSON inputs, outputs, and sub-15ms execution logs. And notice our safety guardrail: the agent invokes `requestCheckoutApproval`, presenting a security modal for explicit human authorization."*

* **1:45 - 2:00 (Conclusion):**
  > *"SmartCart Fashion AI shows how WebMCP turns multi-brand e-commerce into a smart, personalized, agent-native experience. Thank you!"*

---
*Built with ❤️ for the WebMCP Challenge.*
