# 👔 SmartCart Fashion AI — Multi-Brand Clothes, Shoes & Dynamic Outfit Concierge
### Built for the WebMCP Challenge Hackathon

> **SmartCart Fashion AI** is an agent-native multi-brand fashion concierge featuring **44+ products across global brands** (Nike, Ralph Lauren, Levi's, Adidas, Fossil, Timberland, Zara, Patagonia, Lululemon), **dynamic unique outfit generation**, and **persistent User Wardrobe Memory** built strictly on the open **WebMCP standard** (`document.modelContext.registerTool`).

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

## 🛠️ Official WebMCP Protocol Implementation

SmartCart Fashion AI implements the official hackathon standard via `document.modelContext.registerTool`:

```javascript
document.modelContext.registerTool({
  name: "search_products",
  description: "Search 44+ multi-brand clothes, sneakers, jackets, bottoms, and accessories with brand, category, style, and price filters.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search keyword" },
      brand: { type: "string", description: "Filter by brand name" },
      category: { type: "string", enum: ["all", "tops", "bottoms", "footwear", "accessories"] },
      maxPrice: { type: "number", description: "Max price per item in USD" },
      styles: { type: "array", items: { type: "string" }, description: "Style aesthetics" }
    }
  },
  execute: async (input) => {
    // Queries in-memory catalog with active filters
    return results;
  }
});
```

### Complete Registered WebMCP Tools

| Tool Name | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `search_products` / `searchCatalog` | Search 44+ clothes, sneakers, and accessories with brand/style filters | `query`, `brand`, `category`, `maxPrice`, `styles` |
| `generateDynamicOutfit` | Algorithmically creates unique 4-piece outfit matching style & memory | `style`, `occasion`, `preferredBrand`, `maxBudget` |
| `getUserStyleMemory` | Retrieves user's saved sizes, favorite brands, and past picks | *(None)* |
| `updateStyleMemory` | Updates saved sizes (shoe, top, bottom, belt) or brand preferences | `sizes`, `favoriteBrands`, `preferredStyles` |
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
# Clone the repository
git clone https://github.com/Somesh9618/SmartCart-AI.git

# Navigate to the project directory
cd SmartCart-AI

# Start a lightweight local server
npx -y serve .
```
Then open `http://localhost:3000` in your browser.

---

