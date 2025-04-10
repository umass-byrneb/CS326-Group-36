import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class StorageComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('StorageComponent');
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('storage-page');

    const flexContainer = document.createElement('div');
    flexContainer.classList.add('flex-container');

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    const heading = document.createElement('h3');
    heading.textContent = 'Keywords';
    sidebar.appendChild(heading);
    const tagsDiv = document.createElement('div');
    tagsDiv.classList.add('tags');
    ['Garage', 'Room', 'Summer', 'Weekly Storage', 'Monthly Storage'].forEach(text => {
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

    const timeGroup = document.createElement('div');
    timeGroup.classList.add('time-group');
    const timeHeading = document.createElement('p');
    timeHeading.innerHTML = '<strong>Time of Year</strong>';
    timeGroup.appendChild(timeHeading);
    ['Spring', 'Summer', 'Fall', 'Winter'].forEach(text => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      if (text === 'Spring' || text === 'Summer') input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + text));
      timeGroup.appendChild(label);
    });
    sidebar.appendChild(timeGroup);

    const sizeGroup = document.createElement('div');
    sizeGroup.classList.add('size-group');
    const sizeHeading = document.createElement('p');
    sizeHeading.innerHTML = '<strong>Size of Space</strong>';
    sizeGroup.appendChild(sizeHeading);
    [
      { text: 'Small (< 5 sq ft)', checked: false },
      { text: 'Medium (5-10 sq ft)', checked: true },
      { text: 'Large (> 20 sq ft)', checked: false }
    ].forEach(item => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = item.checked;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + item.text));
      sizeGroup.appendChild(label);
    });
    sidebar.appendChild(sizeGroup);

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
    toggleLabel.textContent = 'Sort by:';
    tagToggleGroup.appendChild(toggleLabel);
    ['New', 'Price ascending', 'Price descending'].forEach((text, idx) => {
      const btn = document.createElement('button');
      btn.classList.add('toggle');
      if (idx === 0) btn.classList.add('active');
      btn.textContent = text;
      tagToggleGroup.appendChild(btn);
    });
    topBar.appendChild(tagToggleGroup);
    mainContent.appendChild(topBar);

    const listings = document.createElement('div');
    listings.classList.add('storage-listings');
    const items = [
      {
        title: 'Summer Storage in my home',
        duration: 'June - August',
        cost: '$20 / month',
        size: '~9 sq ft (approx. 3\' x 3\')',
        contact: '000-000-0000',
        description: 'Hi! I will be out of Amherst during June - August for an internship. Offering a storage space in my room, perfect for a few boxes or smaller furniture.'
      },
      {
        title: 'Storage in my Garage',
        duration: 'Year-round',
        cost: '$10 / month',
        size: 'Approximately 5.4 sq ft',
        contact: '000-000-0000',
        description: 'I have extra space in my garage. It\'s great for storing a few bins or small furniture. Rent is month to month. Time can be extended if needed.'
      }
    ];
    items.forEach(item => {
      const storageItem = document.createElement('div');
      storageItem.classList.add('storage-item');
      const infoDiv = document.createElement('div');
      infoDiv.classList.add('storage-info');
      const h4 = document.createElement('h4');
      h4.textContent = item.title;
      infoDiv.appendChild(h4);
      const pDuration = document.createElement('p');
      pDuration.innerHTML = `<strong>Duration:</strong> ${item.duration}`;
      infoDiv.appendChild(pDuration);
      const pCost = document.createElement('p');
      pCost.innerHTML = `<strong>Cost:</strong> ${item.cost}`;
      infoDiv.appendChild(pCost);
      const pSize = document.createElement('p');
      pSize.innerHTML = `<strong>Size:</strong> ${item.size}`;
      infoDiv.appendChild(pSize);
      const pContact = document.createElement('p');
      pContact.innerHTML = `<strong>Contact:</strong> ${item.contact}`;
      infoDiv.appendChild(pContact);
      const pDesc = document.createElement('p');
      pDesc.innerHTML = `<strong>Description:</strong> ${item.description}`;
      infoDiv.appendChild(pDesc);
      storageItem.appendChild(infoDiv);
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('storage-image');
      storageItem.appendChild(imageDiv);
      listings.appendChild(storageItem);
    });
    mainContent.appendChild(listings);

    flexContainer.appendChild(mainContent);
    container.appendChild(flexContainer);
    return container;
  }
}
