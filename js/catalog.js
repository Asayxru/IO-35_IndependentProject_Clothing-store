// catalog.js products data + render + filter/sort/search
(function () {
const PRODUCTS = [
  {
    id: 101,
    name: 'Puffer Jacket North',
    category: 'outerwear',
    categoryLabel: 'Верхній одяг',
    price: 3499,
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Поліестер',
    description: 'Тепла куртка з утеплювачем для зимового сезону.',
    image: 'assets/images/puffer-jacket.jpg'
  },
  {
    id: 102,
    name: 'Wool Sweater Classic',
    category: 'tops',
    categoryLabel: 'Верх',
    price: 1699,
    sizes: ['XS', 'S', 'M', 'L'],
    material: 'Вовна/акрил',
    description: 'М’який светр базового крою для щоденних образів.',
    image: 'assets/images/wool-sweater.jpg'
  },
  {
    id: 103,
    name: 'Hoodie Urban',
    category: 'casual',
    categoryLabel: 'Casual',
    price: 1499,
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Бавовна',
    description: 'Худі вільного крою з капюшоном та кишенею.',
    image: 'assets/images/hoodie.jpg'
  },
  {
    id: 104,
    name: 'Jeans Straight',
    category: 'bottoms',
    categoryLabel: 'Низ',
    price: 1899,
    sizes: ['S', 'M', 'L'],
    material: 'Денім',
    description: 'Джинси прямого крою з класичною посадкою.',
    image: 'assets/images/jeans.jpg'
  },
  {
    id: 105,
    name: 'T-shirt Minimal',
    category: 'tops',
    categoryLabel: 'Верх',
    price: 699,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    material: 'Бавовна',
    description: 'Футболка з мінімалістичним дизайном для базового гардеробу.',
    image: 'assets/images/tshirt.jpg'
  },
  {
    id: 106,
    name: 'Leather Belt',
    category: 'accessories',
    categoryLabel: 'Аксесуари',
    price: 599,
    sizes: ['S', 'M', 'L'],
    material: 'Екошкіра',
    description: 'Ремінь з металевою пряжкою для повсякденного стилю.',
    image: 'assets/images/belt.jpg'
  },
  {
    id: 107,
    name: 'Beanie Hat',
    category: 'accessories',
    categoryLabel: 'Аксесуари',
    price: 399,
    sizes: ['S', 'M', 'L'],
    material: 'Трикотаж',
    description: 'Тепла шапка-біні для холодної погоди.',
    image: 'assets/images/beanie.jpg'
  },
  {
    id: 108,
    name: 'Coat Longline',
    category: 'outerwear',
    categoryLabel: 'Верхній одяг',
    price: 4299,
    sizes: ['S', 'M', 'L'],
    material: 'Шерсть/поліестер',
    description: 'Пальто подовженого крою для класичних образів.',
    image: 'assets/images/coat.jpg'
  }
];

  // Make products available for index page rendering
  window.CATALOG_PRODUCTS = PRODUCTS;

  const container = document.getElementById('catalog-products');
  if (!container) return;

  const qEl = document.getElementById('q');
  const categoryEl = document.getElementById('category');
  const sizeEl = document.getElementById('size');
  const sortEl = document.getElementById('sort');
  const countEl = document.getElementById('results-count');

  function getQueryParams() {
    const p = new URLSearchParams(window.location.search);
    const category = p.get('category');
    if (category && categoryEl) categoryEl.value = category;
  }

  function matchesSearch(p, q) {
    if (!q) return true;
    const x = q.toLowerCase();
    return (
      p.name.toLowerCase().includes(x) ||
      p.description.toLowerCase().includes(x) ||
      p.categoryLabel.toLowerCase().includes(x)
    );
  }

  function matchesCategory(p, category) {
    if (!category || category === 'all') return true;
    return p.category === category;
  }

  function matchesSize(p, size) {
    if (!size || size === 'all') return true;
    return p.sizes.includes(size);
  }

  function sortProducts(list, sort) {
    const arr = [...list];
    switch (sort) {
      case 'price-asc': return arr.sort((a, b) => a.price - b.price);
      case 'price-desc': return arr.sort((a, b) => b.price - a.price);
      case 'name-asc': return arr.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return arr.sort((a, b) => b.name.localeCompare(a.name));
      default: return arr;
    }
  }

function productCardHTML(p) {
  const sizes = p.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
  return `
    <article class="product" data-product-id="${p.id}">
      
      <img
        src="${p.image}"
        alt="${escapeHTML(p.name)}"
        class="product-image"
        onerror="this.src='assets/images/placeholder.jpg'"
      >

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
        <button class="btn primary" type="button" data-add-to-cart>
          Додати в кошик
        </button>
      </div>
    </article>
  `;
}

  function render() {
    const q = qEl?.value?.trim() || '';
    const category = categoryEl?.value || 'all';
    const size = sizeEl?.value || 'all';
    const sort = sortEl?.value || 'default';

    const filtered = PRODUCTS
      .filter(p => matchesSearch(p, q))
      .filter(p => matchesCategory(p, category))
      .filter(p => matchesSize(p, size));

    const sorted = sortProducts(filtered, sort);

    container.innerHTML = sorted.map(productCardHTML).join('');
    if (countEl) countEl.textContent = String(sorted.length);

    // attach add-to-cart
    container.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('[data-product-id]');
        const id = card?.getAttribute('data-product-id');
        const select = card?.querySelector('select');
        const chosen = select?.value || '';

        if (!chosen) {
          alert('Оберіть розмір перед додаванням у кошик.');
          return;
        }

        const p = PRODUCTS.find(x => String(x.id) === String(id));
        if (!p) return;

        window.CartAPI.addItem({
          id: p.id,
          name: p.name,
          price: p.price,
          size: chosen,
          category: p.category,
        });
      });
    });
  }

  [qEl, categoryEl, sizeEl, sortEl].forEach(el => {
    el?.addEventListener('input', render);
    el?.addEventListener('change', render);
  });

  getQueryParams();
  render();

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
})();
