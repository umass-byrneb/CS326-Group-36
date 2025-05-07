import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class StorageComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('StorageComponent');
    this.locations = [
      { title: 'Hadley EZ Storage', price: 15, postingDate: '2025-03-18', tag: 'Garage', delivery: 'Pick Up', image: 'assets/images/storage1.jpg' },
      { title: 'Home Storage', price: 10, postingDate: '2025-03-19', tag: 'Room', delivery: 'Drop Off To You', image: 'assets/images/storage2.jpg' },
      { title: 'Pioneer Storage', price: 8, postingDate: '2025-03-20', tag: 'Basement', delivery: 'Pick Up', image: 'assets/images/storage3.jpg' },
      { title: 'Stuff‑It Storage', price: 20, postingDate: '2025-03-21', tag: 'Office', delivery: 'Drop Off To You', image: 'assets/images/storage4.jpg' }
    ];
    const maxPrice = Math.max(...this.locations.map(l => l.price));
    this.state = {
      categories: new Set(),
      deliveries: new Set(),
      maxCost: maxPrice,
      search: '',
      sort: 'New'
    };
    this.dynamicTags = new Map();
  }

  render() {
    this.element = document.createElement('section');
    this.element.classList.add('storage-page');

    this.notificationDiv = document.createElement('div');
    this.notificationDiv.classList.add('notification');
    this.notificationDiv.style.display = 'none';
    this.element.appendChild(this.notificationDiv);

    const title = document.createElement('h2');
    title.classList.add('section-title');
    title.textContent = 'Choose a Storage Location';
    this.element.appendChild(title);

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
      ['Garage', 'Room', 'Basement', 'Office'],
      opt => {
        this._toggleFilter('categories', opt);
        this._renderGrid();
      }
    );

    this._renderCostSlider(sidebar);

    this._renderCheckboxGroup(
      sidebar,
      'Delivery',
      ['Pick Up', 'Drop Off To You'],
      opt => {
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
      placeholder: 'Search storage…'
    });
    this.searchInput.classList.add('search-bar');
    this.searchInput.addEventListener('input', e => {
      this.state.search = e.target.value.toLowerCase();
      this._renderGrid();
    });
    topBar.appendChild(this.searchInput);

    this._renderSortButtons(topBar);

    this.productsGrid = document.createElement('div');
    this.productsGrid.classList.add('products-grid');
    main.appendChild(this.productsGrid);

    this._renderGrid();

    return this.element;
  }

  _renderCheckboxGroup(root, label, options, onChange) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('checkbox-group');
    wrapper.innerHTML = `<p><strong>${label}</strong></p>`;
    options.forEach(opt => {
      const lbl = document.createElement('label');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.category = opt;
      cb.addEventListener('change', () => {
        this._toggleDynamicTag(opt, cb.checked);
        onChange(opt);
      });
      lbl.append(cb, document.createTextNode(' ' + opt));
      wrapper.appendChild(lbl);
    });
    root.appendChild(wrapper);
  }

  _renderCostSlider(root) {
    const label = Object.assign(document.createElement('label'), {
      htmlFor: 'cost-slider',
      innerHTML: '<strong>Max Cost</strong>'
    });
    this.costSlider = document.createElement('input');
    this.costSlider.type = 'range';
    this.costSlider.id = 'cost-slider';
    this.costSlider.min = 0;
    this.costSlider.max = this.state.maxCost;
    this.costSlider.value = this.state.maxCost;
    this.costSlider.addEventListener('input', () => {
      this.state.maxCost = +this.costSlider.value;
      this._updateCostDisplay();
      this._renderGrid();
    });
    this.costDisplay = document.createElement('p');
    this.costDisplay.classList.add('cost-range');
    root.append(label, this.costSlider, this.costDisplay);
    this._updateCostDisplay();
  }

  _renderSortButtons(root) {
    const group = document.createElement('div');
    group.classList.add('tag-toggle-group');
    ['New', 'Price ascending', 'Price descending'].forEach(opt => {
      const btn = document.createElement('button');
      btn.classList.add('toggle');
      btn.textContent = opt;
      if (opt === this.state.sort) btn.classList.add('active');
      btn.addEventListener('click', () => {
        this.state.sort = opt;
        group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._renderGrid();
      });
      group.appendChild(btn);
    });
    root.appendChild(group);
  }

  _toggleFilter(key, value) {
    const set = this.state[key];
    set.has(value) ? set.delete(value) : set.add(value);
  }

  _toggleDynamicTag(cat, checked) {
    if (checked && !this.dynamicTags.has(cat)) {
      const tag = document.createElement('span');
      tag.classList.add('tag');
      tag.textContent = cat;
      const removeBtn = document.createElement('span');
      removeBtn.classList.add('remove-tag');
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        this.element
          .querySelectorAll(`input[data-category="${cat}"]`)
          .forEach(cb => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change'));
          });
      });
      tag.appendChild(removeBtn);
      this.dynamicTags.set(cat, tag);
      this.tagsDiv.appendChild(tag);
    } else if (!checked) {
      const tag = this.dynamicTags.get(cat);
      if (tag) {
        tag.remove();
        this.dynamicTags.delete(cat);
      }
    }
  }

  _updateCostDisplay() {
    this.costDisplay.textContent = `$0 – $${this.state.maxCost}`;
  }

  _showNotification(msg) {
    this.notificationDiv.textContent = msg;
    this.notificationDiv.style.display = 'block';
    setTimeout(() => {
      this.notificationDiv.style.display = 'none';
    }, 3000);
  }

  _renderGrid() {
    this.productsGrid.innerHTML = '';
    const { categories, deliveries, maxCost, search, sort } = this.state;
    const stored = JSON.parse(localStorage.getItem('toStoreItems') || '[]');

    let items = this.locations.filter(p => {
      const okCost = p.price <= maxCost;
      const okSearch = p.title.toLowerCase().includes(search);
      const okCat = !categories.size || categories.has(p.tag);
      const okDel = !deliveries.size || deliveries.has(p.delivery);
      return okCost && okSearch && okCat && okDel;
    });

    if (sort === 'New') {
      items.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
    } else if (sort.includes('ascending')) {
      items.sort((a, b) => a.price - b.price);
    } else {
      items.sort((a, b) => b.price - a.price);
    }

    items.forEach(loc => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="product-image">
          <img src="${loc.image}" alt="${loc.title}">
        </div>
        <h4>${loc.title}</h4>
        <p>$${loc.price.toFixed(2)}</p>
      `;
      card.addEventListener('click', () => {
        if (stored.length === 0) {
          this._showNotification('Please select at least one item to store.');
          return;
        }
        if (!localStorage.getItem('currentUser')) {
          this._showNotification('Please log in to store items.');
          return;
        }
        this._showConfirmation(loc, stored);
      });
      this.productsGrid.appendChild(card);
    });
  }

  _showConfirmation(loc, items) {
    document.body.querySelectorAll('.confirmation-overlay').forEach(el => el.remove());
    const overlay = document.createElement('div');
    overlay.classList.add('confirmation-overlay');
    const box = document.createElement('div');
    box.classList.add('confirmation-box');
    const names = items.map(i => i.name).join(', ');
    const total = loc.price * items.length;
    box.innerHTML = `
      <h3>Confirm Storage</h3>
      <p><strong>Location:</strong> ${loc.title}</p>
      <p><strong>Items:</strong> ${names}</p>
      <p><strong>Total Cost:</strong> $${total.toFixed(2)}</p>
    `;
    const btns = document.createElement('div');
    btns.classList.add('confirm-buttons');
    const cancel = document.createElement('button');
    cancel.classList.add('btn','btn-neutral');
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => overlay.remove());
    const confirm = document.createElement('button');
    confirm.classList.add('btn','btn-primary');
    confirm.textContent = 'Confirm';
    confirm.addEventListener('click', async () => {
      await Promise.all(items.map(i =>
        fetch(`/v1/tasks/${i.id}`, { method: 'DELETE' })
      ));
      localStorage.removeItem('toStoreItems');
      overlay.remove();
      window.location.hash = '#user';
    });
    btns.append(cancel, confirm);
    box.appendChild(btns);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }
}
