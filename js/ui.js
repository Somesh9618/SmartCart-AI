/**
 * SmartCart Fashion AI - User Interface Controller with Memory Profile & Dynamic Generator
 */

import { store } from './state.js';
import { webMCP } from './webmcp.js';
import { agentEngine } from './agent.js';
import { BRANDS_LIST } from './data.js';

export class FashionUIController {
  constructor() {
    this.dom = {};
    this.initDOM();
    this.bindEvents();
    this.renderAll();
  }

  initDOM() {
    this.dom = {
      // Products & Catalog
      productsGrid: document.getElementById("productsGrid"),
      productCountBadge: document.getElementById("productCountBadge"),
      categoryTabs: document.getElementById("categoryTabs"),
      brandSelect: document.getElementById("brandSelect"),
      styleChips: document.getElementById("styleChips"),
      searchInput: document.getElementById("searchInput"),

      // Dynamic Outfit Showcase Card
      dynamicOutfitContainer: document.getElementById("dynamicOutfitContainer"),
      btnQuickGenerate: document.getElementById("btnQuickGenerate"),
      dynamicStyleSelect: document.getElementById("dynamicStyleSelect"),

      // Cart
      cartBadge: document.getElementById("cartBadge"),
      cartItemsList: document.getElementById("cartItemsList"),
      cartSubtotal: document.getElementById("cartSubtotal"),
      cartPromoRow: document.getElementById("cartPromoRow"),
      cartPromoCode: document.getElementById("cartPromoCode"),
      cartDiscount: document.getElementById("cartDiscount"),
      cartTax: document.getElementById("cartTax"),
      cartDelivery: document.getElementById("cartDelivery"),
      cartTotal: document.getElementById("cartTotal"),
      budgetRemainVal: document.getElementById("budgetRemainVal"),

      // Agent Chat
      chatMessages: document.getElementById("chatMessages"),
      chatInput: document.getElementById("chatInput"),
      btnSendChat: document.getElementById("btnSendChat"),
      agentStatusDot: document.getElementById("agentStatusDot"),
      agentStatusText: document.getElementById("agentStatusText"),

      // WebMCP Inspector Drawer
      inspectorDrawer: document.getElementById("inspectorDrawer"),
      btnOpenInspector: document.getElementById("btnOpenInspector"),
      btnCloseInspector: document.getElementById("btnCloseInspector"),
      mcpLogsStream: document.getElementById("mcpLogsStream"),
      btnExportManifest: document.getElementById("btnExportManifest"),

      // Human-in-the-Loop Modal
      approvalModal: document.getElementById("approvalModal"),
      approvalTokenVal: document.getElementById("approvalTokenVal"),
      approvalAddressVal: document.getElementById("approvalAddressVal"),
      approvalSlotVal: document.getElementById("approvalSlotVal"),
      approvalTotalVal: document.getElementById("approvalTotalVal"),
      btnAuthorizeOrder: document.getElementById("btnAuthorizeOrder"),
      btnCancelApproval: document.getElementById("btnCancelApproval"),

      // Toast container
      toastContainer: document.getElementById("toastContainer")
    };
  }

  bindEvents() {
    // 1. Search Input
    this.dom.searchInput?.addEventListener("input", (e) => {
      store.setFilters({ searchQuery: e.target.value });
    });

    // 2. Category Tabs
    this.dom.categoryTabs?.addEventListener("click", (e) => {
      const tab = e.target.closest(".category-tab");
      if (!tab) return;
      const cat = tab.dataset.category;
      this.dom.categoryTabs.querySelectorAll(".category-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      store.setFilters({ category: cat });
    });

    // 3. Brand Selector Dropdown
    this.dom.brandSelect?.addEventListener("change", (e) => {
      store.setFilters({ brand: e.target.value });
    });

    // 4. Style Chips
    this.dom.styleChips?.addEventListener("click", (e) => {
      const chip = e.target.closest(".dietary-chip");
      if (!chip) return;
      chip.classList.toggle("active");
      const activeStyles = Array.from(this.dom.styleChips.querySelectorAll(".dietary-chip.active")).map(c => c.dataset.style);
      store.setFilters({ styles: activeStyles });
    });

    // 5. Dynamic Outfit Generator Button
    this.dom.btnQuickGenerate?.addEventListener("click", () => {
      const style = this.dom.dynamicStyleSelect ? this.dom.dynamicStyleSelect.value : "smart_casual";
      this.generateAndRenderFreshOutfit(style);
    });

    // 6. Cart List Quantity Actions
    this.dom.cartItemsList?.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-qty");
      if (!btn) return;
      const cartIdx = parseInt(btn.dataset.idx, 10);
      const action = btn.dataset.action;
      const item = store.cart[cartIdx];
      if (!item) return;

      if (action === "inc") {
        store.updateCartQuantity(cartIdx, item.quantity + 1);
      } else if (action === "dec") {
        store.updateCartQuantity(cartIdx, item.quantity - 1);
      }
    });

    // 7. Agent Chat Submission
    const submitChat = () => {
      const val = this.dom.chatInput?.value.trim();
      if (!val) return;
      this.dom.chatInput.value = "";
      agentEngine.handleUserMessage(val);
    };

    this.dom.btnSendChat?.addEventListener("click", submitChat);
    this.dom.chatInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitChat();
    });

    // 8. WebMCP Inspector Toggle
    this.dom.btnOpenInspector?.addEventListener("click", () => {
      this.dom.inspectorDrawer?.classList.add("open");
    });
    this.dom.btnCloseInspector?.addEventListener("click", () => {
      this.dom.inspectorDrawer?.classList.remove("open");
    });

    // Export Manifest
    this.dom.btnExportManifest?.addEventListener("click", () => {
      const manifest = webMCP.getToolsManifest();
      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "smartcart-fashion-webmcp-manifest.json";
      a.click();
      this.showToast("Fashion WebMCP JSON Manifest exported!");
    });

    // 9. Human in the Loop Approval Actions
    this.dom.btnAuthorizeOrder?.addEventListener("click", () => {
      if (store.pendingApproval) {
        const token = store.pendingApproval.token;
        const finalized = store.authorizePendingApproval(token);
        this.dom.approvalModal?.classList.remove("active");
        this.showToast(`Wardrobe Order ${finalized.orderId} Authorized & Placed!`, "success");
        agentEngine.emit("AGENT_MESSAGE", {
          role: "agent",
          type: "final",
          text: `🎉 **Wardrobe Order Authorized & Confirmed!**\nOrder Reference: \`${finalized.orderId}\`. Scheduled for express courier delivery.`
        });
      }
    });

    this.dom.btnCancelApproval?.addEventListener("click", () => {
      store.rejectPendingApproval();
      this.dom.approvalModal?.classList.remove("active");
      this.showToast("Checkout authorization canceled.", "warning");
    });

    // --- State Subscriptions ---
    store.subscribe((event) => {
      if (event === "FILTERS_CHANGED") {
        this.renderProducts();
      } else if (event === "CART_UPDATED" || event === "PROMO_APPLIED") {
        this.renderCart();
        this.renderProducts();
      } else if (event === "MCP_LOGGED") {
        this.renderMcpLogs();
      } else if (event === "APPROVAL_REQUESTED") {
        this.showApprovalModal(store.pendingApproval);
      }
    });

    // --- Agent Subscriptions ---
    agentEngine.subscribe((event, data) => {
      if (event === "STATUS_CHANGE") {
        if (data.isBusy) {
          this.dom.agentStatusDot?.classList.add("busy");
          if (this.dom.agentStatusText) this.dom.agentStatusText.textContent = "Styling...";
        } else {
          this.dom.agentStatusDot?.classList.remove("busy");
          if (this.dom.agentStatusText) this.dom.agentStatusText.textContent = "Online (Fashion WebMCP)";
        }
      } else if (event === "AGENT_MESSAGE") {
        this.appendChatMessage(data);
      } else if (event === "TOOL_CALL") {
        this.appendToolCallMessage(data);
        this.highlightToolTarget(data.tool, data.args);
      }
    });
  }

  renderAll() {
    this.renderBrandSelect();
    this.renderProducts();
    this.renderCart();
    this.renderMcpLogs();
    this.renderWelcomeMemoryGreeting();
    this.generateAndRenderFreshOutfit("smart_casual");
  }

  renderBrandSelect() {
    if (!this.dom.brandSelect) return;
    this.dom.brandSelect.innerHTML = BRANDS_LIST.map(b => `
      <option value="${b === 'All Brands' ? 'all' : b}">${b}</option>
    `).join('');
  }

  // Welcome greeting referencing persistent memory
  renderWelcomeMemoryGreeting() {
    if (!this.dom.chatMessages) return;
    const mem = store.memory;
    const hasHistory = mem.favoriteBrands.length > 0 || mem.pastSelections.length > 0;

    let greetingHtml = "";
    if (hasHistory) {
      const topBrands = mem.favoriteBrands.slice(0, 3).join(", ") || "Nike, Levi's, Ralph Lauren";
      greetingHtml = `
        👋 <strong>Welcome back!</strong><br><br>
        I recall your wardrobe profile:<br>
        • <strong>Saved Sizes:</strong> Shoe <code>${mem.preferredSizes.shoes}</code>, Top <code>${mem.preferredSizes.tops}</code>, Bottom <code>${mem.preferredSizes.bottoms}</code><br>
        • <strong>Favorite Brands:</strong> <em>${topBrands}</em><br><br>
        Ask me anything like: <em>"Style a smart casual look for tonight"</em> or <em>"Find me white sneakers"</em>!
      `;
    } else {
      greetingHtml = `
        👋 <strong>Hi! I'm your SmartCart AI Stylist.</strong><br><br>
        I connect natively to 44+ brand-name clothes and sneakers via <strong>WebMCP</strong>.<br><br>
        As you browse and select items, I automatically remember your sizes and favorite brands for future suggestions. What look would you like to explore today?
      `;
    }

    this.dom.chatMessages.innerHTML = `
      <div class="chat-bubble agent">
        ${greetingHtml}
      </div>
    `;
  }

  // Dynamic Outfit Generator & Showcase
  generateAndRenderFreshOutfit(style = "smart_casual") {
    if (!this.dom.dynamicOutfitContainer) return;
    const outfit = store.generateDynamicOutfit({ style });

    this.dom.dynamicOutfitContainer.innerHTML = `
      <div class="dynamic-outfit-card glass-panel" style="padding: 1.25rem; border: 1px solid var(--border-active);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div>
            <div style="font-size:0.7rem; font-weight:800; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.05em;">
              ⚡ Dynamic AI Algorithmic Combination
            </div>
            <h3 style="font-family:var(--font-display); font-size:1.15rem; font-weight:700;">${outfit.title}</h3>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem; color:var(--text-muted);">4-Piece Bundle:</div>
            <div style="font-size:1.2rem; font-weight:800; color:var(--primary);">$${outfit.totalCost.toFixed(2)}</div>
          </div>
        </div>

        <div class="dynamic-pieces-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-bottom: 1rem;">
          ${outfit.pieces.map(p => `
            <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.6rem; display:flex; gap:0.6rem; align-items:center;">
              <img src="${p.product.image}" alt="${p.product.name}" style="width:50px; height:50px; object-fit:cover; border-radius:6px;" />
              <div style="flex:1; overflow:hidden;">
                <div style="font-size:0.65rem; color:var(--accent-cyan); font-weight:700;">${p.role}</div>
                <div style="font-size:0.8rem; font-weight:700; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  ${p.product.brand}
                </div>
                <div style="font-size:0.7rem; color:var(--text-muted);">$${p.product.price.toFixed(2)} • Size: <strong style="color:#fff;">${p.size}</strong></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; color:var(--text-dim);">Sizes tailored to your AI wardrobe memory</span>
          <button class="btn btn-primary" onclick="window.addDynamicOutfitBundle('${encodeURIComponent(JSON.stringify(outfit))}')" style="padding: 0.45rem 1rem; font-size: 0.825rem;">
            🛒 Add All 4 Pieces to Wardrobe Cart
          </button>
        </div>
      </div>
    `;
  }

  // Render Multi-Brand Product Catalog
  renderProducts() {
    if (!this.dom.productsGrid) return;
    const products = store.getFilteredProducts();
    if (this.dom.productCountBadge) {
      this.dom.productCountBadge.textContent = `${products.length} styles`;
    }

    if (products.length === 0) {
      this.dom.productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-dim);">
          <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No apparel or footwear match the selected brand and filters.</p>
          <button class="btn btn-secondary" onclick="window.resetSmartCartFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    this.dom.productsGrid.innerHTML = products.map(p => {
      const inCartQty = store.cart
        .filter(i => i.product.id === p.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      return `
        <div class="product-card" id="card-${p.id}">
          <div class="product-img-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <div class="stock-tag">${p.stock} in stock</div>
            <div class="brand-pill-tag" style="position:absolute; top:0.5rem; left:0.5rem; background:rgba(10,14,23,0.85); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,0.15); color:#fff; font-size:0.68rem; font-weight:800; padding:0.15rem 0.5rem; border-radius:999px;">
              ${p.brand}
            </div>
          </div>
          <div class="product-info">
            <div class="product-tags">
              ${p.styles.slice(0, 2).map(tag => `<span class="tag-pill tag-${tag}">${tag.replace('_', ' ')}</span>`).join('')}
            </div>
            <h4 class="product-name">${p.name}</h4>
            <div class="product-unit">${p.material}</div>
            
            <div style="margin: 0.35rem 0; font-size: 0.7rem; color: var(--text-muted); display:flex; gap:0.25rem; flex-wrap:wrap;">
              ${p.sizes ? p.sizes.slice(0, 4).map(s => `<span style="background:rgba(255,255,255,0.06); padding:1px 4px; border-radius:3px;">${s}</span>`).join('') : ''}
            </div>

            <div class="product-action-row">
              <span class="product-price">$${p.price.toFixed(2)}</span>
              <button class="btn-add-cart" onclick="window.addToCartDirect('${p.id}')" title="Add item to wardrobe">
                ${inCartQty > 0 ? `<span style="font-size:0.75rem; font-weight:800; color:var(--primary);">${inCartQty}</span>` : `+`}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Fashion Cart
  renderCart() {
    const summary = store.getCartSummary();

    if (this.dom.cartBadge) {
      this.dom.cartBadge.textContent = summary.totalItems;
      this.dom.cartBadge.style.display = summary.totalItems > 0 ? "flex" : "none";
    }

    if (this.dom.cartItemsList) {
      if (store.cart.length === 0) {
        this.dom.cartItemsList.innerHTML = `
          <div style="text-align: center; padding: 1.5rem; color: var(--text-dim); font-size: 0.85rem;">
            🛍️ Wardrobe cart is empty.<br>Browse 44+ brand items or ask the AI Stylist for recommendations!
          </div>
        `;
      } else {
        this.dom.cartItemsList.innerHTML = store.cart.map((item, idx) => `
          <div class="cart-item-row" id="cart-item-${item.product.id}">
            <div class="cart-item-meta">
              <div class="cart-item-name"><strong style="color:var(--accent-cyan);">${item.product.brand}</strong> ${item.product.name}</div>
              <div class="cart-item-sub">
                Size: <span style="color:var(--text-main); font-weight:700;">${item.selectedSize}</span> • $${item.product.price.toFixed(2)}
              </div>
            </div>
            <div class="cart-item-controls">
              <button class="btn-qty" data-idx="${idx}" data-action="dec">-</button>
              <span style="font-weight:700; width:18px; text-align:center;">${item.quantity}</span>
              <button class="btn-qty" data-idx="${idx}" data-action="inc">+</button>
            </div>
            <div style="font-weight:700; min-width: 50px; text-align:right;">
              $${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        `).join('');
      }
    }

    if (this.dom.cartSubtotal) this.dom.cartSubtotal.textContent = `$${summary.subtotal.toFixed(2)}`;
    if (this.dom.cartTax) this.dom.cartTax.textContent = `$${summary.estimatedTax.toFixed(2)}`;
    if (this.dom.cartDelivery) this.dom.cartDelivery.textContent = summary.deliveryFee === 0 ? "FREE" : `$${summary.deliveryFee.toFixed(2)}`;
    if (this.dom.cartTotal) this.dom.cartTotal.textContent = `$${summary.total.toFixed(2)}`;

    if (this.dom.cartPromoRow) {
      if (summary.appliedPromo) {
        this.dom.cartPromoRow.style.display = "flex";
        if (this.dom.cartPromoCode) this.dom.cartPromoCode.textContent = summary.appliedPromo;
        if (this.dom.cartDiscount) this.dom.cartDiscount.textContent = `-$${summary.discountAmount.toFixed(2)}`;
      } else {
        this.dom.cartPromoRow.style.display = "none";
      }
    }

    if (this.dom.budgetRemainVal) {
      this.dom.budgetRemainVal.textContent = `$${summary.remainingBudget.toFixed(2)}`;
      this.dom.budgetRemainVal.style.color = summary.isOverBudget ? "var(--accent-rose)" : "var(--primary)";
    }
  }

  // Render Telemetry
  renderMcpLogs() {
    if (!this.dom.mcpLogsStream) return;
    if (store.mcpLogs.length === 0) {
      this.dom.mcpLogsStream.innerHTML = `
        <div style="text-align:center; padding: 2rem; color: var(--text-dim);">
          No Fashion WebMCP tool calls recorded yet.<br>Ask the AI Stylist in chat to trigger tools!
        </div>
      `;
      return;
    }

    this.dom.mcpLogsStream.innerHTML = store.mcpLogs.map(log => `
      <div class="mcp-log-card">
        <div class="mcp-log-header">
          <span class="mcp-tool-name">⚡ ${log.tool}()</span>
          <div>
            <span class="mcp-latency-tag">${log.durationMs}ms</span>
            <span style="color:var(--text-dim); margin-left:0.4rem;">${log.timestamp}</span>
          </div>
        </div>
        <div style="margin-bottom:0.25rem; color:var(--text-dim);">Input Parameters:</div>
        <pre class="mcp-json-block">${JSON.stringify(log.params, null, 2)}</pre>
        ${log.result ? `
          <div style="margin:0.25rem 0; color:var(--text-dim);">Return Payload:</div>
          <pre class="mcp-json-block" style="color:#34d399;">${JSON.stringify(log.result, null, 2)}</pre>
        ` : ''}
        ${log.error ? `
          <div style="margin:0.25rem 0; color:var(--accent-rose);">Error:</div>
          <pre class="mcp-json-block" style="color:var(--accent-rose);">${log.error}</pre>
        ` : ''}
      </div>
    `).join('');
  }

  highlightToolTarget(toolName, args) {
    if (args.productId) {
      const el = document.getElementById(`card-${args.productId}`);
      if (el) {
        el.classList.add("agent-active");
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => el.classList.remove("agent-active"), 2500);
      }
    }
  }

  appendChatMessage({ role, text, type }) {
    if (!this.dom.chatMessages) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role} ${type || ''}`;
    
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(0,0,0,0.3); padding:0.1rem 0.3rem; border-radius:3px;">$1</code>')
      .replace(/\n/g, '<br>');

    bubble.innerHTML = formatted;
    this.dom.chatMessages.appendChild(bubble);
    this.dom.chatMessages.scrollTop = this.dom.chatMessages.scrollHeight;
  }

  appendToolCallMessage({ tool, args }) {
    if (!this.dom.chatMessages) return;
    const badge = document.createElement("div");
    badge.className = "tool-call-badge";
    badge.innerHTML = `⚙️ WebMCP: <strong>${tool}</strong>(${JSON.stringify(args)})`;
    this.dom.chatMessages.appendChild(badge);
    this.dom.chatMessages.scrollTop = this.dom.chatMessages.scrollHeight;
  }

  showApprovalModal(approval) {
    if (!this.dom.approvalModal || !approval) return;
    if (this.dom.approvalTokenVal) this.dom.approvalTokenVal.textContent = approval.token;
    if (this.dom.approvalAddressVal) this.dom.approvalAddressVal.textContent = approval.orderData.deliveryAddress;
    if (this.dom.approvalSlotVal) this.dom.approvalSlotVal.textContent = approval.orderData.deliverySlot;
    if (this.dom.approvalTotalVal) this.dom.approvalTotalVal.textContent = `$${approval.orderData.summary.total.toFixed(2)}`;
    this.dom.approvalModal.classList.add("active");
  }

  showToast(message, type = "info") {
    if (!this.dom.toastContainer) return;
    const toast = document.createElement("div");
    toast.style.cssText = `
      background: rgba(17, 24, 39, 0.95);
      border: 1px solid ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#06b6d4'};
      color: #fff;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = message;
    this.dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

window.addToCartDirect = (productId) => {
  store.addToCart(productId, 1);
};

window.addDynamicOutfitBundle = (outfitJson) => {
  try {
    const outfit = JSON.parse(decodeURIComponent(outfitJson));
    store.addOutfitBundleToCart(outfit);
    window.smartCartUI.showToast("All 4 outfit pieces added to your cart!", "success");
  } catch (e) {
    console.error("Failed to add outfit bundle:", e);
  }
};

window.resetSmartCartFilters = () => {
  store.resetFilters();
  if (document.getElementById("brandSelect")) document.getElementById("brandSelect").value = "all";
};
