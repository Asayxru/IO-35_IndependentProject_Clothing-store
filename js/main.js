// main.js — burger menu + contact form validation + render top products on index
(function () {
  // Burger menu
  const burgerBtn = document.querySelector('[data-burger]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const overlay = document.querySelector('[data-overlay]');
  const mobileClose = document.querySelector('[data-mobile-close]');

  function openMenu() {
    if (!mobileMenu || !overlay) return;
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu || !overlay) return;
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  burgerBtn?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // Close menu on mobile link click
  document.querySelectorAll('.mobile-link').forEach((a) => {
    a.addEventListener('click', closeMenu);
  });

  // Contact form validation (index.html only)
  const form = document.getElementById('contact-form');
  if (form) {
    const success = document.getElementById('form-success');

    function setError(fieldName, message) {
      const el = document.querySelector(`[data-error-for="${fieldName}"]`);
      if (el) el.textContent = message;
    }

    function clearErrors() {
      ['name', 'email', 'message'].forEach((f) => setError(f, ''));
      if (success) success.textContent = '';
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const name = form.elements['name']?.value?.trim() || '';
      const email = form.elements['email']?.value?.trim() || '';
      const message = form.elements['message']?.value?.trim() || '';

      let ok = true;

      if (name.length < 2) {
        setError('name', "Вкажіть ім’я (мінімум 2 символи).");
        ok = false;
      }
      if (!isValidEmail(email)) {
        setError('email', 'Вкажіть коректний email.');
        ok = false;
      }
      if (message.length < 10) {
        setError('message', 'Повідомлення має містити щонайменше 10 символів.');
        ok = false;
      }

      if (!ok) return;

      // Demo submit
      form.reset();
      if (success) success.textContent = 'Повідомлення надіслано (демо-режим).';
    });
  }

  // Render top products (index.html only)
  const topContainer = document.getElementById('top-products');
  if (topContainer && window.CATALOG_PRODUCTS?.length) {
    const top = window.CATALOG_PRODUCTS.slice(0, 4);
    topContainer.innerHTML = top.map((p) => productCardHTML(p, true)).join('');
    attachAddToCartHandlers(topContainer);
  }

  function productCardHTML(p, compact) {
    const sizes = p.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    return `
      <article class="product" data-product-id="${p.id}">
        <h3 class="product-title">${escapeHTML(p.name)}</h3>
        <div class="badges">
          <span class="badge">${escapeHTML(p.categoryLabel)}</span>
          <span class="badge">${escapeHTML(p.material)}</span>
        </div>
        <div class="product-price">${p.price} грн</div>
        <p class="small">${escapeHTML(p.description)}</p>

        <label class="label" for="size-${p.id}">Розмір</label>
        <select class="select" id="size-${p.id}">
          <option value="">Оберіть</option>
          ${sizes}
        </select>

        <div class="product-actions">
          <button class="btn primary" type="button" data-add-to-cart>Додати в кошик</button>
          ${compact ? `<a class="btn secondary" href="catalog.html">Детальніше</a>` : ``}
        </div>
      </article>
    `;
  }

  function attachAddToCartHandlers(scope) {
    scope.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('[data-product-id]');
        const id = card?.getAttribute('data-product-id');
        if (!id) return;
        const select = card.querySelector('select');
        const size = select?.value || '';

        if (!size) {
          alert('Оберіть розмір перед додаванням у кошик.');
          return;
        }

        const p = window.CATALOG_PRODUCTS.find(x => String(x.id) === String(id));
        if (!p) return;

        window.CartAPI.addItem({
          id: p.id,
          name: p.name,
          price: p.price,
          size,
          category: p.category,
        });
      });
    });
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
