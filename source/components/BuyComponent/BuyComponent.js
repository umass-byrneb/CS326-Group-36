import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class BuyComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('BuyComponent');
    this.dynamicTags = new Map();
    // Sample products
    this.sampleProducts = [
      { title: 'Coffee Table', price: '$0', postingDate: '2025-03-20', tag: 'Furniture', delivery: 'Pick Up' },
      { title: 'TV', price: '$30', postingDate: '2025-03-21', tag: 'Other', delivery: 'Drop Off To You' },
      { title: 'Water Boiler', price: '$5', postingDate: '2025-03-22', tag: 'Kitchen Item', delivery: 'Pick Up' },
      { title: 'Standing Lamp', price: '$10', postingDate: '2025-03-23', tag: 'Decor', delivery: 'Drop Off To You' },
      { title: 'Air Fryer', price: '$10', postingDate: '2025-03-24', tag: 'Kitchen Item', delivery: 'Drop Off To You' },
      { title: 'Coat Rack', price: '$0', postingDate: '2025-03-25', tag: 'Storage', delivery: 'Pick Up' }
    ];
    this.currentCostFilter = 0;
    this.currentSearch = "";
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('buy-page');

    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flex-container');

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');

    const heading = document.createElement('h3');
    heading.textContent = 'Keywords';
    sidebar.appendChild(heading);

    this.tagsDiv = document.createElement('div');
    this.tagsDiv.classList.add('tags');
    sidebar.appendChild(this.tagsDiv);

    const checkboxGroup = document.createElement('div');
    checkboxGroup.classList.add('checkbox-group');
    const categories = [
      'Furniture', 'Kitchen Item', 'Bathroom Item', 
      'Decor', 'Storage', 'Other'
    ];
    categories.forEach(cat => {
      const label = document.createElement('label');
      label.setAttribute('data-category', cat);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      checkbox.setAttribute('data-category', cat);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + cat));
      checkboxGroup.appendChild(label);
      checkbox.addEventListener('change', (e) => {
        this.toggleDynamicTag(cat, e.target.checked);
        this.renderProductsGrid();
      });
    });
    sidebar.appendChild(checkboxGroup);

    // Cost slider
    const costLabel = document.createElement('label');
    costLabel.setAttribute('for', 'cost-slider');
    costLabel.innerHTML = '<strong>Cost</strong>';
    sidebar.appendChild(costLabel);
    const costSlider = document.createElement('input');
    costSlider.type = 'range';
    costSlider.id = 'cost-slider';
    costSlider.name = 'cost-slider';
    const maxPrice = Math.max(...this.sampleProducts.map(prod => parseFloat(prod.price.substring(1))));
    costSlider.max = maxPrice;
    costSlider.value = maxPrice;
    this.currentCostFilter = maxPrice;
    const costDisplay = document.createElement('p');
    costDisplay.classList.add('cost-range');
    costDisplay.textContent = "$0 - $" + costSlider.value;
    sidebar.appendChild(costSlider);
    sidebar.appendChild(costDisplay);
    costSlider.addEventListener('input', (e) => {
      this.currentCostFilter = parseFloat(e.target.value);
      costDisplay.textContent = "$0 - $" + e.target.value;
      this.renderProductsGrid();
    });

    const deliveryDiv = document.createElement('div');
    deliveryDiv.classList.add('delivery-group');
    const deliveryHeading = document.createElement('p');
    deliveryHeading.innerHTML = '<strong>Delivery</strong>';
    deliveryDiv.appendChild(deliveryHeading);
    const deliveryOptions = ['Pick Up', 'Drop Off To You'];
    deliveryOptions.forEach(option => {
      const label = document.createElement('label');
      label.setAttribute('data-category', option);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = false;
      checkbox.setAttribute('data-category', option);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + option));
      deliveryDiv.appendChild(label);
      checkbox.addEventListener('change', (e) => {
        this.toggleDynamicTag(option, e.target.checked);
        this.renderProductsGrid();
      });
    });
    sidebar.appendChild(deliveryDiv);

    flexContainer.appendChild(sidebar);

    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    const topBar = document.createElement('div');
    topBar.classList.add('top-bar');
    
    // Search Bar: 
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search';
    searchBar.classList.add('search-bar');
    searchBar.addEventListener('input', (e) => {
      this.currentSearch = e.target.value.toLowerCase();
      this.renderProductsGrid();
    });
    topBar.appendChild(searchBar);

    // Toggle Buttons for sorting: 
    const tagToggleGroup = document.createElement('div');
    tagToggleGroup.classList.add('tag-toggle-group');
    const toggleOptions = ['New', 'Price ascending', 'Price descending'];
    toggleOptions.forEach((text, idx) => {
      const btn = document.createElement('button');
      btn.classList.add('toggle');
      if (idx === 0) btn.classList.add('active');
      btn.textContent = text;
      btn.addEventListener('click', () => {
        tagToggleGroup.querySelectorAll('.toggle').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        this.sortProducts(text);
      });
      tagToggleGroup.appendChild(btn);
    });
    topBar.appendChild(tagToggleGroup);
    mainContent.appendChild(topBar);

    this.productsGrid = document.createElement('div');
    this.productsGrid.classList.add('products-grid');
    mainContent.appendChild(this.productsGrid);
    this.renderProductsGrid();

    flexContainer.appendChild(mainContent);
    container.appendChild(flexContainer);

    return container;
  }

  renderProductsGrid() {
    this.productsGrid.innerHTML = '';

    const categoryCheckboxes = document.querySelectorAll('.checkbox-group input[data-category]');
    const checkedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.getAttribute('data-category'));

    const deliveryCheckboxes = document.querySelectorAll('.delivery-group input[data-category]');
    const checkedDelivery = Array.from(deliveryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.getAttribute('data-category'));

    const filteredProducts = this.sampleProducts.filter(prod => {
      const productPrice = parseFloat(prod.price.substring(1));
      const matchesCost = productPrice <= this.currentCostFilter;
      const matchesSearch = this.matchesSearch(prod.title, this.currentSearch);
      const categoryPass = checkedCategories.length === 0 ? true : checkedCategories.includes(prod.tag);
      const deliveryPass = checkedDelivery.length === 0 ? true : checkedDelivery.includes(prod.delivery);
      return matchesCost && matchesSearch && categoryPass && deliveryPass;
    });
    
    filteredProducts.forEach(prod => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('product-image');
      card.appendChild(imageDiv);

      const h4 = document.createElement('h4');
      h4.textContent = prod.title;
      card.appendChild(h4);

      const priceP = document.createElement('p');
      priceP.textContent = prod.price;
      card.appendChild(priceP);

      card.setAttribute('data-postingDate', prod.postingDate);
      card.setAttribute('data-price', prod.price.replace('$', ''));
      this.productsGrid.appendChild(card);
    });
  }

  matchesSearch(title, searchQuery) {
    if (searchQuery.trim() === "") return true;
    const tokens = searchQuery.trim().split(/\s+/);
    const words = title.toLowerCase().split(/\s+/);
    let tokenIndex = 0;
    for (let word of words) {
      if (word.startsWith(tokens[tokenIndex])) {
        tokenIndex++;
        if (tokenIndex === tokens.length) return true;
      }
    }
    return false;
  }

  sortProducts(sortOption) {
    if (sortOption === 'New') {
      this.sampleProducts.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
    } else if (sortOption === 'Price ascending') {
      this.sampleProducts.sort((a, b) => parseFloat(a.price.substring(1)) - parseFloat(b.price.substring(1)));
    } else if (sortOption === 'Price descending') {
      this.sampleProducts.sort((a, b) => parseFloat(b.price.substring(1)) - parseFloat(a.price.substring(1)));
    }
    this.renderProductsGrid();
  }

  // Dynamic Tags 
  toggleDynamicTag(category, isChecked) {
    if (isChecked) {
      this.addDynamicTag(category);
    } else {
      this.removeDynamicTag(category);
    }
  }

  addDynamicTag(category) {
    if (this.dynamicTags.has(category)) return;
    const tag = document.createElement('span');
    tag.classList.add('tag');
    tag.textContent = category;
    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-tag');
    removeBtn.textContent = ' x';
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
    if (this.dynamicTags.has(category)) {
      const tag = this.dynamicTags.get(category);
      if (tag.parentNode) tag.parentNode.removeChild(tag);
      this.dynamicTags.delete(category);
    }
  }

  toggleCheckbox(category, checkValue) {
    const selector = `input[type="checkbox"][data-category="${category}"]`;
    const checkboxes = document.querySelectorAll(selector);
    checkboxes.forEach(cb => {
      cb.checked = checkValue;
      cb.dispatchEvent(new Event('change'));
    });
  }
}
