import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class BuyComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('BuyComponent');
    this.products = [];
    this.state = {
      categories: new Set(),
      deliveries: new Set(),
      maxCost: 0,
      search: '',
      sort: 'New',
    };
    this.dynamicTags = new Map();
  }

  render() {
    this.element = document.createElement('section');
    this.element.classList.add('buy-page');

    this.notificationDiv = document.createElement('div');
    this.notificationDiv.classList.add('notification');
    this.notificationDiv.style.display = 'none';
    this.element.appendChild(this.notificationDiv);

    const flex = document.createElement('div');
    flex.classList.add('flex-container');
    this.element.appendChild(flex);

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    flex.appendChild(sidebar);

    this.tagsDiv = document.createElement('div');
    this.tagsDiv.classList.add('tags');
    sidebar.append(
      Object.assign(document.createElement('h3'), { textContent: 'Filters' }),
      this.tagsDiv
    );

    this._renderCheckboxGroup(
      sidebar,
      'Category',
      ['Furniture', 'Kitchen Item', 'Bathroom Item', 'Decor', 'Storage', 'Other'],
      (opt) => {
        this._toggleFilter('categories', opt);
        this._renderGrid();
      }
    );

    this._renderCostSlider(sidebar);

    this._renderCheckboxGroup(
      sidebar,
      'Delivery',
      ['Pick Up', 'Drop Off To You'],
      (opt) => {
        this._toggleFilter('deliveries', opt);
        this._renderGrid();
      }
    );

    const main = document.createElement('div');
    main.classList.add('main-content');
    flex.appendChild(main);

    const topBar = document.createElement('div');
    topBar.classList.add('top-bar');
    main.appendChild(topBar);

    this.searchInput = Object.assign(document.createElement('input'), {
      type: 'text',
      placeholder: 'Search items…',
    });
    this.searchInput.classList.add('search-bar');
    this.searchInput.addEventListener('input', (e) => {
      this.state.search = e.target.value.toLowerCase();
      this._renderGrid();
    });
    topBar.appendChild(this.searchInput);

    this._renderSortButtons(topBar);

    this.productsGrid = document.createElement('div');
    this.productsGrid.classList.add('products-grid');
    main.appendChild(this.productsGrid);

    this._loadProducts();

    return this.element;
  }

  async _loadProducts() {
    try {
      const res = await fetch('/v1/tasks');
      const { tasks } = await res.json();
      this.products = tasks.filter((t) => t.listed !== false);

      const prices = this.products.map((p) =>
        parseFloat((p.cost || '').replace(/^\$/, '')) || 0
      );
      this.state.maxCost = prices.length ? Math.max(...prices) : 0;
      this.costSlider.max = this.state.maxCost;
      this.costSlider.value = this.state.maxCost;
      this._updateCostDisplay();

      this._renderGrid();
    } catch (err) {
      console.error(err);
      this.productsGrid.innerHTML = `<p class="error">Failed to load items.</p>`;
    }
  }

  _renderCheckboxGroup(root, label, opts, onChange) {
    const wrap = document.createElement('div');
    wrap.classList.add('checkbox-group');
    wrap.innerHTML = `<p><strong>${label}</strong></p>`;

    opts.forEach((opt) => {
      const lbl = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.category = opt;
      cb.addEventListener('change', () => {
        this._toggleDynamicTag(opt, cb.checked);
        onChange(opt);
      });
      lbl.append(cb, document.createTextNode(' ' + opt));
      wrap.appendChild(lbl);
    });

    root.appendChild(wrap);
  }

  _renderCostSlider(root) {
    const lbl = Object.assign(document.createElement('label'), {
      htmlFor: 'cost-slider',
      innerHTML: '<strong>Max Cost</strong>',
    });
    this.costSlider = document.createElement('input');
    this.costSlider.type = 'range';
    this.costSlider.id = 'cost-slider';
    this.costSlider.min = 0;
    this.costSlider.addEventListener('input', () => {
      this.state.maxCost = +this.costSlider.value;
      this._updateCostDisplay();
      this._renderGrid();
    });

    this.costDisplay = document.createElement('p');
    this.costDisplay.classList.add('cost-range');

    root.append(lbl, this.costSlider, this.costDisplay);
    this._updateCostDisplay();
  }

  _renderSortButtons(root) {
    const grp = document.createElement('div');
    grp.classList.add('tag-toggle-group');

    ['New', 'Price ascending', 'Price descending'].forEach((opt) => {
      const btn = document.createElement('button');
      btn.classList.add('toggle');
      btn.textContent = opt;
      if (opt === this.state.sort) btn.classList.add('active');
      btn.addEventListener('click', () => {
        this.state.sort = opt;
        grp.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this._renderGrid();
      });
      grp.appendChild(btn);
    });

    root.appendChild(grp);
  }

  _toggleFilter(key, val) {
    const set = this.state[key];
    set.has(val) ? set.delete(val) : set.add(val);
  }

  _toggleDynamicTag(cat, checked) {
    if (checked && !this.dynamicTags.has(cat)) {
      const tag = document.createElement('span');
      tag.classList.add('tag');
      tag.textContent = cat;

      const x = document.createElement('span');
      x.classList.add('remove-tag');
      x.textContent = '×';
      x.addEventListener('click', () => {
        this.element
          .querySelectorAll(`input[data-category="${cat}"]`)
          .forEach((cb) => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change'));
          });
      });

      tag.appendChild(x);
      this.dynamicTags.set(cat, tag);
      this.tagsDiv.appendChild(tag);
    } else if (!checked) {
      const t = this.dynamicTags.get(cat);
      if (t) {
        t.remove();
        this.dynamicTags.delete(cat);
      }
    }
  }

  _updateCostDisplay() {
    this.costDisplay.textContent = `$0 – $${this.state.maxCost}`;
  }

  _showNotification(msg) {
    this.notificationDiv.textContent = msg;
    this.notificationDiv.style.display = 'block';
    setTimeout(() => (this.notificationDiv.style.display = 'none'), 3000);
  }

  _renderGrid() {
    this.productsGrid.innerHTML = '';
    const { categories, deliveries, maxCost, search, sort } = this.state;
    const user = localStorage.getItem('currentUser');

    let items = this.products.filter((p) => {
      const costVal = parseFloat((p.cost || '').replace(/^\$/, '')) || 0;
      const title = ((p.name ?? p.heading) || '').toLowerCase();
      return (
        costVal <= maxCost &&
        title.includes(search) &&
        (!categories.size || categories.has(p.tag)) &&
        (!deliveries.size || deliveries.has(p.delivery))
      );
    });

    if (sort === 'New') {
      items.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
    } else if (sort.includes('ascending')) {
      items.sort(
        (a, b) =>
          parseFloat(a.cost.replace(/^\$/, '')) -
          parseFloat(b.cost.replace(/^\$/, ''))
      );
    } else {
      items.sort(
        (a, b) =>
          parseFloat(b.cost.replace(/^\$/, '')) -
          parseFloat(a.cost.replace(/^\$/, ''))
      );
    }

    items.forEach((prod) => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="product-image">
          <img src="${prod.image}" alt="${prod.name ?? prod.heading}">
        </div>
        <h4>${prod.name ?? prod.heading}</h4>
        <p>${prod.cost}</p>
      `;
      card.addEventListener('click', () => {
        if (!user) {
          this._showNotification('Please log in to purchase items.');
          return;
        }
        this._showPurchaseModal(prod);
      });
      this.productsGrid.appendChild(card);
    });
  }

  _showPurchaseModal(prod) {
    document.body.querySelectorAll('.confirmation-overlay').forEach((el) => el.remove());

    const overlay = document.createElement('div');
    overlay.classList.add('confirmation-overlay');

    const box = document.createElement('div');
    box.classList.add('confirmation-box');
    box.innerHTML = `
      <h3>Confirm Purchase</h3>
      <p><strong>Item:</strong> ${prod.name ?? prod.heading}</p>
      <p><strong>Total Cost:</strong> ${prod.cost}</p>
    `;

    const btns = document.createElement('div');
    btns.classList.add('confirm-buttons');

    const cancel = document.createElement('button');
    cancel.classList.add('btn', 'btn-neutral');
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => overlay.remove());

    const confirm = document.createElement('button');
    confirm.classList.add('btn', 'btn-primary');
    confirm.textContent = 'Confirm';
    confirm.addEventListener('click', async () => {
      await fetch(`/v1/tasks/${prod.id}`, { method: 'DELETE' });
      overlay.remove();
      window.location.hash = '#user';
    });

    btns.append(cancel, confirm);
    box.appendChild(btns);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
}
