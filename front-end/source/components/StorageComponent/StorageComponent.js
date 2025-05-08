import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { Events } from '../../eventhub/Events.js'
import { EventHub } from '../../eventhub/EventHub.js';


export class StorageComponent extends BaseComponent {
  #container = null;
  #flexContainer = null;

  constructor() {
    super();
    this.loadCSS('StorageComponent');
  }

  render() {
    this.#createContainer();
    this.#flexContainer.appendChild(this.#createSideBar());

    //main content 
    const mainContent = document.createElement('main');
    mainContent.classList.add('main-content');

    mainContent.appendChild(this.#createTopBarDiv());

    const listings = document.createElement('div');
    listings.classList.add('storage-listings');
    mainContent.appendChild(listings);

    this.#flexContainer.appendChild(mainContent);
    this.#container.appendChild(this.#flexContainer);
    this.#attachEventListeners();
    return this.#container;
  }

  #createContainer() {
    this.#container = document.createElement('section');
    this.#container.classList.add('storage-page');

    this.#flexContainer = document.createElement('div');
    this.#flexContainer.classList.add('flex-container');
  }

  #createSideBar() {
    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    const heading = document.createElement('h3');
    heading.textContent = 'Keywords';
    sidebar.appendChild(heading);

    //generate tags
    const tagsDiv = document.createElement('div');
    tagsDiv.classList.add('tags');
    sidebar.appendChild(tagsDiv);

    // //cost slider
    // const costLabel = document.createElement('label');
    // costLabel.setAttribute('for', 'cost-slider');
    // costLabel.innerHTML = '<strong>Cost: </strong>';
    // sidebar.appendChild(costLabel);

    // const costValueDisplay = document.createElement('span');
    // costValueDisplay.classList.add('cost-value');
    // costValueDisplay.textContent = '100';
    // costLabel.appendChild(costValueDisplay);


    // const costSlider = document.createElement('input');
    // costSlider.type = 'range';
    // costSlider.id = 'cost-slider';
    // costSlider.name = 'cost-slider';
    // costSlider.min = '0';
    // costSlider.max = '100';
    // costSlider.value = '50';

    // Cost filter section
    const costSection = document.createElement('div');
    costSection.classList.add('cost-section');

    // Label
    const costLabel = document.createElement('label');
    costLabel.setAttribute('for', 'cost-slider');
    costLabel.innerHTML = '<strong>Cost:</strong>';
    sidebar.appendChild(costLabel);

    // slider with value
    const sliderValueSet = document.createElement('span');
    // Min/Max labels below slider
    const minLabel = document.createElement('span');
    minLabel.textContent = '$0';
    const maxLabel = document.createElement('span');
    maxLabel.textContent = '$300';

    // Slider element
    const costSlider = document.createElement('input');
    costSlider.type = 'range';
    costSlider.id = 'cost-slider';
    costSlider.min = 0;
    costSlider.max = 300;
    costSlider.value = 300;
    costSlider.step = 10;
    costSlider.classList.add('cost-slider');

    // Update on slide
    costSlider.addEventListener('input', () => {
      maxLabel.textContent = `$${costSlider.value}`;
      const hub = EventHub.getInstance();
      hub.publish(Events.StorageCostFilter, parseInt(costSlider.value));
    });

    sliderValueSet.appendChild(minLabel);
    sliderValueSet.appendChild(costSlider);
    sliderValueSet.appendChild(maxLabel);

    costSection.appendChild(sliderValueSet);
    sidebar.appendChild(costSection);


    //time of the year filter
    const timeGroup = document.createElement('div');
    timeGroup.classList.add('time-group');
    const timeHeading = document.createElement('p');
    timeHeading.innerHTML = '<strong>Time of Year</strong>';
    timeGroup.appendChild(timeHeading); 
    ['Spring', 'Summer', 'Fall', 'Winter'].forEach(text => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      // if (text === 'Spring' || text === 'Summer') input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + text));
      label.classList.add('time-group-input')
      timeGroup.appendChild(label);
    });
    sidebar.appendChild(timeGroup);

    // storage size filter
    const sizeGroup = document.createElement('div');
    sizeGroup.classList.add('size-group');
    const sizeHeading = document.createElement('p');
    sizeHeading.innerHTML = '<strong>Size of Space</strong>';
    sizeGroup.appendChild(sizeHeading);
    [
      { text: 'Small (< 100 sq ft)', checked: false },
      { text: 'Medium (100-220 sq ft)', checked: false },
      { text: 'Large (> 220 sq ft)', checked: false }
    ].forEach(item => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = item.checked;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + item.text));
      label.classList.add('size-group-input')
      sizeGroup.appendChild(label);
    });
    sidebar.appendChild(sizeGroup);

    return sidebar;
  }


  #createTopBarDiv() {
    const topBar = document.createElement('div');
    topBar.classList.add('top-bar');

    //search bar 
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search';
    searchBar.classList.add('search-bar');
    topBar.appendChild(searchBar);

    // new, price ascending, and descending buttons 
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

    return topBar;
  }

  #populateListing(items) {
    const listing = this.#container.querySelector('.storage-listings');
    listing.innerHTML = '';

    items.forEach(item => {
      const itemDiv = this.#createStorageItem(item);
      listing.appendChild(itemDiv);
    })
  }

  #createStorageItem(item) {
    console.log("item to render: ", item);
    const storageItem = document.createElement('div');
    storageItem.classList.add('storage-item');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('storage-info');
    const h4 = document.createElement('h4');
    h4.textContent = item.title;

    infoDiv.appendChild(h4);
    const pDuration = document.createElement('p');
    pDuration.innerHTML = `<strong>Duration: </strong> ${item.duration}`;
    infoDiv.appendChild(pDuration);
    const pCost = document.createElement('p');
    pCost.innerHTML = `<strong>Cost: </strong> $${item.cost}`;
    infoDiv.appendChild(pCost);
    const pSize = document.createElement('p');
    pSize.innerHTML = `<strong>Size: </strong> ${item.size} sq ft`;
    infoDiv.appendChild(pSize);
    const pContact = document.createElement('p');
    pContact.innerHTML = `<strong>Contact: </strong> ${item.contact}`;
    infoDiv.appendChild(pContact);
    const pDesc = document.createElement('p');
    pDesc.innerHTML = `<strong>Description: </strong> ${item.description}`;
    infoDiv.appendChild(pDesc);

    storageItem.appendChild(infoDiv);
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('storage-image');
    const img = document.createElement('img');
    img.classList.add('img');
    img.src = item.image; // Set the image source
    img.alt = item.title || 'Storage image'; // Optional alt text
    imageDiv.appendChild(img);
    // imageDiv.src = item.image;
    storageItem.appendChild(imageDiv);
    return storageItem;
  }

  #addTag(value) {
    const tagsDiv = this.#container.querySelector('.tags');

    const tag = document.createElement('span');
    tag.classList.add('tag');
    tag.textContent = value;

    const remove = document.createElement('span');
    remove.classList.add('remove-tag');
    remove.textContent = 'x';

    const hub = EventHub.getInstance();
    //event listener for removing tag
    remove.addEventListener('click', () => {
      tag.remove();
      hub.subscribe(Events.StorageRemoveTag, () => this.#removeTag());
      hub.publish(Events.StorageRemoveTag);
    })

    tag.appendChild(remove);
    tagsDiv.appendChild(tag);
    
    //add a publish for filtering after it has been added
    hub.publish(Events.StorageFilterAddTag, value);

  }

  #removeTag() {
    const tags = this.#container.querySelectorAll('.tag');
    console.log("tags: ", tags);
    const tagsList = []
    tags.forEach(tag => tagsList.push(tag.textContent.slice(0, -1)));
    console.log("tagList: ", tagsList);
    const hub = EventHub.getInstance();
    // if (tagsList.length == 0) {
    //   hub.publish(Events.StorageUnfilteredList);
    // } else hub.publish(Events.StorageFilterRemoveTag, tagsList);
    hub.publish(Events.StorageFilterRemoveTag, tagsList);
  }

  #attachEventListeners() {
    //create a hub instance
    const hub = EventHub.getInstance();

    //storage listings
    hub.subscribe(Events.LoadStorageSuccess, (items) => {
      console.log("items for populate listing: ", items);
      this.#populateListing(items)
    });
    hub.publish(Events.LoadStorageListings, 0);

    //search bar
    hub.subscribe(Events.StorageAddTag, (newTag) => this.#addTag(newTag));
    const searchBar = this.#container.querySelector('.search-bar');
    searchBar.addEventListener("keydown", function(event) {
      if (event.key == "Enter") {
        const value = searchBar.value.trim();
        hub.publish(Events.StorageAddTag, value);
        searchBar.value = "";
      }
    })

    //price ascending, descending and new button. 
    const allButtons = this.#container.querySelectorAll('.toggle');
    allButtons.forEach(button => {
      button.addEventListener('click', () => {
        allButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        if (button.textContent == "Price ascending") hub.publish(Events.StoragePriceAscend);
        else if (button.textContent == "Price descending") hub.publish(Events.StoragePriceDescend);
        else hub.publish(Events.StorageUnfilteredList, 0);
      })
    })

    //sidebar filters: storage space
    const sizes = this.#container.querySelectorAll('.size-group-input');
    // const sizeLabel = []
    sizes.forEach(size => {
      // sizeLabel.push(size.textContent);
      size.addEventListener('click', () => {
        let range = []
        if (size.textContent[1] == "S") range = [-1, 100];
        if (size.textContent[1] == "M") range = [100, 220];
        if (size.textContent[1] == "L") range = [220, -1];
        hub.publish(Events.StorageSpaceFilter, range);
      });
    });
    

  }
  
}