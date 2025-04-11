import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class BuyComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('BuyComponent');
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

    const tagsDiv = document.createElement('div');
    tagsDiv.classList.add('tags');
    ['Furniture', 'Storage', 'Kitchen Supplies'].forEach(text => {
      const tag = document.createElement('span');
      tag.classList.add('tag');
      tag.textContent = text;
      const remove = document.createElement('span');
      remove.classList.add('remove-tag');
      remove.textContent = 'x';
      tag.appendChild(remove);
      tagsDiv.appendChild(tag);
    });
    sidebar.appendChild(tagsDiv);

    const checkboxGroup = document.createElement('div');
    checkboxGroup.classList.add('checkbox-group');
    const categories = [
      { label: 'Furniture', description: 'Living room and bedroom furnishings.' },
      { label: 'Kitchen Supplies', description: 'Anything that belongs in the kitchen.' },
      { label: 'Storage', description: 'Offering space to store your belongings.' }
    ];
    categories.forEach(cat => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + cat.label));
      checkboxGroup.appendChild(label);
      const small = document.createElement('small');
      small.textContent = cat.description;
      checkboxGroup.appendChild(small);
    });
    sidebar.appendChild(checkboxGroup);

    const costLabel = document.createElement('label');
    costLabel.setAttribute('for', 'cost-slider');
    costLabel.innerHTML = '<strong>Cost</strong>';
    sidebar.appendChild(costLabel);
    const costSlider = document.createElement('input');
    costSlider.type = 'range';
    costSlider.id = 'cost-slider';
    costSlider.name = 'cost-slider';
    costSlider.min = '0';
    costSlider.max = '100';
    costSlider.value = '50';
    sidebar.appendChild(costSlider);

    const distanceDiv = document.createElement('div');
    distanceDiv.classList.add('distance-group');
    const distanceHeading = document.createElement('p');
    distanceHeading.innerHTML = '<strong>Distance to UMass</strong>';
    distanceDiv.appendChild(distanceHeading);
    ['< 2 mi', '< 5 mi', '< 10 mi'].forEach(text => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + text));
      distanceDiv.appendChild(label);
    });
    sidebar.appendChild(distanceDiv);

    const deliveryDiv = document.createElement('div');
    deliveryDiv.classList.add('delivery-group');
    const deliveryHeading = document.createElement('p');
    deliveryHeading.innerHTML = '<strong>Delivery</strong>';
    deliveryDiv.appendChild(deliveryHeading);
    ['Pick Up', 'Drop Off To You', 'Label'].forEach(text => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + text));
      deliveryDiv.appendChild(label);
    });
    sidebar.appendChild(deliveryDiv);

    flexContainer.appendChild(sidebar);

    const mainContent = document.createElement('div');
    mainContent.classList.add('main-content');

    const topBar = document.createElement('div');
    topBar.classList.add('top-bar');
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search';
    searchBar.classList.add('search-bar');
    topBar.appendChild(searchBar);
    const tagToggleGroup = document.createElement('div');
    tagToggleGroup.classList.add('tag-toggle-group');
    const toggleLabel = document.createElement('label');
    tagToggleGroup.appendChild(toggleLabel);
    ['New', 'Price ascending', 'Price descending', 'Rating'].forEach((text, idx) => {
      const btn = document.createElement('button');
      btn.classList.add('toggle');
      if (idx === 0) btn.classList.add('active');
      btn.textContent = text;
      tagToggleGroup.appendChild(btn);
    });
    topBar.appendChild(tagToggleGroup);
    mainContent.appendChild(topBar);

    const productsGrid = document.createElement('div');
    productsGrid.classList.add('products-grid');
    const sampleProducts = [
      { title: 'Coffee Table', price: '$0' },
      { title: 'TV', price: '$30' },
      { title: 'Water Boiler', price: '$5' },
      { title: 'Standing Lamp', price: '$10' },
      { title: 'Air Fryer', price: '$10' },
      { title: 'Coat Rack', price: '$0' }
    ];
    sampleProducts.forEach(prod => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('product-image');
      card.appendChild(imageDiv);
      const h4 = document.createElement('h4');
      h4.textContent = prod.title;
      card.appendChild(h4);
      const p = document.createElement('p');
      p.textContent = prod.price;
      card.appendChild(p);
      productsGrid.appendChild(card);
    });
    mainContent.appendChild(productsGrid);

    flexContainer.appendChild(mainContent);
    container.appendChild(flexContainer);
    return container;
  }
}
