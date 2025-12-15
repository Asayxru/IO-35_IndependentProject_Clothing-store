// cart.js — localStorage cart + modal rendering + counters
(function () {
  const STORAGE_KEY = 'clothing_store_cart_v1';

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function calcCount(items) {
    return items.reduce((sum, it) => sum + (it.qty || 0), 0);
  }

  function calcTotal(items) {
    return items.reduce((sum, it) => sum + (it.price * it.qty), 0);
  }

  function updateBadge() {
    const items = loadCart();
    const count = calcCount(items);
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = String(count);
    });
  }

  function openModal() {
    const modal = document.querySelector('[data-cart-modal]');
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    renderModal();
  }

  function closeModal() {
    const modal = document.querySelector('[data-cart-modal]');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }

  function renderModal() {
    const listEl = document.querySelector('[data-cart-list]');
    const totalEl = document.querySelector('[data-cart-total]');
    if (!listEl || !totalEl) return;

    const items = loadCart();
    if (items.length === 0) {
      listEl.innerHTML = `<div class="card"><strong>Кошик порожній.</strong><p class="small">Додайте товари з каталогу.</p></div>`;
      totalEl.textContent = '0 грн';
      updateBadge();
      return;
    }

    listEl.innerHTML = items.map(item => `
      <div class="cart-item" data-cart-item="${item.id}::${item.size}">
        <div>
          <div class="cart-item-title">${escapeHTML(item.name)}</div>
          <p class="cart-item-meta">Розмір: ${escapeHTML(item.size)} • Ціна: ${item.price} грн</p>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" type="button" data-qty-dec>-</button>
          <strong>${item.qty}</strong>
          <button class="qty-btn" type="button" data-qty-inc>+</button>
          <button class="qty-btn" type="button" data-remove>×</button>
        </div>
      </div>
    `).join('');

    totalEl.textContent = `${calcTotal(items)} грн`;

    // Bind actions
    listEl.querySelectorAll('[data-cart-item]').forEach(row => {
      const key = row.getAttribute('data-cart-item'); // id::size
      row.querySelector('[data-qty-inc]')?.addEventListener('click', () => changeQty(key, +1));
      row.querySelector('[data-qty-dec]')?.addEventListener('click', () => changeQty(key, -1));
      row.querySelector('[data-remove]')?.addEventListener('click', () => removeItem(key));
    });

    updateBadge();
  }

  function addItem({ id, name, price, size, category }) {
    const items = loadCart();
    const key = `${id}::${size}`;
    const existing = items.find(x => `${x.id}::${x.size}` === key);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id, name, price, size, category, qty: 1 });
    }
    saveCart(items);
    updateBadge();
  }

  function changeQty(key, delta) {
    const items = loadCart();
    const idx = items.findIndex(x => `${x.id}::${x.size}` === key);
    if (idx === -1) return;

    items[idx].qty += delta;
    if (items[idx].qty <= 0) items.splice(idx, 1);

    saveCart(items);
    renderModal();
  }

  function removeItem(key) {
    const items = loadCart().filter(x => `${x.id}::${x.size}` !== key);
    saveCart(items);
    renderModal();
  }

  function clearCart() {
    saveCart([]);
    renderModal();
  }

  function checkout() {
    const items = loadCart();
    const total = calcTotal(items);
    if (!items.length) return;
    alert(`Замовлення оформлено (демо). Сума: ${total} грн`);
    clearCart();
    closeModal();
  }

  // Expose API
  window.CartAPI = { addItem };

  // Bind UI buttons
  document.querySelectorAll('[data-cart-open]').forEach(btn => btn.addEventListener('click', openModal));
  document.querySelectorAll('[data-cart-close]').forEach(btn => btn.addEventListener('click', closeModal));
  document.querySelectorAll('[data-cart-clear]').forEach(btn => btn.addEventListener('click', clearCart));
  document.querySelectorAll('[data-cart-checkout]').forEach(btn => btn.addEventListener('click', checkout));

  // Close modal on background click
  document.querySelectorAll('[data-cart-modal]').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  });

  // Initial badge
  updateBadge();

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
