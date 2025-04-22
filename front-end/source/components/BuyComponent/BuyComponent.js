import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class BuyComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('BuyComponent');
    this.products = [];
    this.dynamicTags = new Map();
    this.currentCostFilter = 0;
    this.currentSearch = '';
    this.currentSort = 'New';
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('buy-page');

    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flex-container');

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    sidebar.innerHTML = '<h3>Keywords</h3>';
    this.tagsDiv = document.createElement('div');
    this.tagsDiv.classList.add('tags');
    sidebar.appendChild(this.tagsDiv);

    const catGroup = document.createElement('div');
    catGroup.classList.add('checkbox-group');
    ['Furniture','Kitchen Item','Bathroom Item','Decor','Storage','Other']
      .forEach(cat => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" data-category="${cat}"> ${cat}`;
        label.querySelector('input').addEventListener('change', () => {
          this.toggleDynamicTag(cat, label.querySelector('input').checked);
          this.renderProductsGrid();
        });
        catGroup.appendChild(label);
      });
    sidebar.appendChild(catGroup);

    const costLabel = document.createElement('label');
    costLabel.textContent = 'Cost';
    costLabel.htmlFor = 'cost-slider';
    sidebar.appendChild(costLabel);
    this.costDisplay = document.createElement('p');
    sidebar.appendChild(this.costDisplay);
    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.id = 'cost-slider';
    this.slider.addEventListener('input', () => {
      this.currentCostFilter = +this.slider.value;
      this.costDisplay.textContent = `$0 - $${this.slider.value}`;
      this.renderProductsGrid();
    });
    sidebar.appendChild(this.slider);

    const delGroup = document.createElement('div');
    delGroup.classList.add('delivery-group');
    ['Pick Up','Can Deliver'].forEach(opt => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" data-category="${opt}"> ${opt}`;
      label.querySelector('input').addEventListener('change', () => {
        this.toggleDynamicTag(opt, label.querySelector('input').checked);
        this.renderProductsGrid();
      });
      delGroup.appendChild(label);
    });
    sidebar.appendChild(delGroup);

    flexContainer.appendChild(sidebar);

    const main = document.createElement('div');
    main.classList.add('main-content');

    const topBar = document.createElement('div');
    topBar.classList.add('top-bar');
    this.searchBar = document.createElement('input');
    this.searchBar.type = 'text';
    this.searchBar.placeholder = 'Search';
    this.searchBar.addEventListener('input', () => {
      this.currentSearch = this.searchBar.value.toLowerCase();
      this.renderProductsGrid();
    });
    topBar.appendChild(this.searchBar);

    const toggleGroup = document.createElement('div');
    toggleGroup.classList.add('tag-toggle-group');
    ['New','Price ascending','Price descending']
      .forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        if (opt === this.currentSort) btn.classList.add('active');
        btn.addEventListener('click', () => {
          this.currentSort = opt;
          toggleGroup.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.renderProductsGrid();
        });
        toggleGroup.appendChild(btn);
      });
    topBar.appendChild(toggleGroup);

    main.appendChild(topBar);

    this.productsGrid = document.createElement('div');
    this.productsGrid.classList.add('products-grid');
    main.appendChild(this.productsGrid);

    flexContainer.appendChild(main);
    container.appendChild(flexContainer);

    this.loadProducts();

    return container;
  }

  async loadProducts() {
    try {
      const res = await fetch('/v1/tasks');
      if (!res.ok) throw new Error('Failed to fetch products');
      const { tasks } = await res.json();

      this.products = tasks
        .filter(t => t.listed === true)
        .map(p => ({
          title: p.name,
          price: p.cost,
          postingDate: p.postingDate || new Date().toISOString().split('T')[0],
          tag: p.tag,
          delivery: p.delivery,
          image: p.image
        }));

      const maxPrice = this.products.length
        ? Math.max(...this.products.map(x => parseFloat(x.price.slice(1))))
        : 0;
      this.slider.min = '0';
      this.slider.max = String(maxPrice);
      this.slider.value = String(maxPrice);
      this.currentCostFilter = maxPrice;
      this.costDisplay.textContent = `$0 - $${maxPrice}`;

      this.renderProductsGrid();
    } catch (err) {
      console.error(err);
      this.productsGrid.innerHTML = '<p>Error loading products.</p>';
    }
  }

  renderProductsGrid() {
    this.productsGrid.innerHTML = '';
    if (!this.products.length) {
      this.productsGrid.innerHTML = '<p>No items available for purchase.</p>';
      return;
    }

    const checkedCats = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
      .map(cb => cb.dataset.category);
    const checkedDels = Array.from(document.querySelectorAll('.delivery-group input:checked'))
      .map(cb => cb.dataset.category);

    let filtered = this.products.filter(p => {
      const price = parseFloat(p.price.slice(1));
      const matchesCost = price <= this.currentCostFilter;
      const matchesSearch = !this.currentSearch
        || p.title.toLowerCase().includes(this.currentSearch);
      const catOk = !checkedCats.length || checkedCats.includes(p.tag);
      const delOk = !checkedDels.length || checkedDels.includes(p.delivery);
      return matchesCost && matchesSearch && catOk && delOk;
    });

    if (this.currentSort === 'New') {
      filtered.sort((a,b) => new Date(b.postingDate) - new Date(a.postingDate));
    } else if (this.currentSort === 'Price ascending') {
      filtered.sort((a,b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)));
    } else {
      filtered.sort((a,b) => parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1)));
    }

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('product-image');
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.title;
      imgDiv.appendChild(img);
      card.appendChild(imgDiv);

      const h4 = document.createElement('h4');
      h4.textContent = p.title;
      card.appendChild(h4);

      const priceP = document.createElement('p');
      priceP.textContent = p.price;
      card.appendChild(priceP);

      this.productsGrid.appendChild(card);
    });
  }

  toggleDynamicTag(category, checked) {
    if (checked) this.addDynamicTag(category);
    else this.removeDynamicTag(category);
  }

  addDynamicTag(category) {
    if (this.dynamicTags.has(category)) return;
    const tag = document.createElement('span');
    tag.classList.add('tag');
    tag.textContent = category;
    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-tag');
    removeBtn.textContent = ' ×';
    tag.appendChild(removeBtn);
    this.dynamicTags.set(category, tag);
    this.tagsDiv.appendChild(tag);
    tag.addEventListener('click', () => {
      this.toggleCheckbox(category, false);
      this.removeDynamicTag(category);
      this.renderProductsGrid();
    });
  }

  removeDynamicTag(category) {
    const tag = this.dynamicTags.get(category);
    if (tag) {
      tag.remove();
      this.dynamicTags.delete(category);
    }
  }

  toggleCheckbox(category, value) {
    document
      .querySelectorAll(`input[data-category="${category}"]`)
      .forEach(cb => {
        cb.checked = value;
        cb.dispatchEvent(new Event('change'));
      });
  }
}
