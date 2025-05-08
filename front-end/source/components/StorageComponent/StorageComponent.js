import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { Events } from '../../eventhub/Events.js'
import { EventHub } from '../../eventhub/EventHub.js';


export class StorageComponent extends BaseComponent {
  #container = null;
  #flexContainer = null;

  constructor() {
    super();
    this.loadCSS('StorageComponent');
    this.state = {
      sizeRange: [-1, -1],
    }
  }

  render() {
    this.#createContainer();
    this.#flexContainer.appendChild(this.#createSideBar());

    this.modalOverlay = document.createElement('div');
    this.modalOverlay.classList.add('modal-overlay');
    this.modalOverlay.style.display = 'none';
    document.body.appendChild(this.modalOverlay);

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

    //cost slider
    const costSection = document.createElement('div');
    costSection.classList.add('cost-section');

    const costLabel = document.createElement('label');
    costLabel.setAttribute('for', 'cost-slider');
    costLabel.innerHTML = '<strong>Cost:</strong>';
    sidebar.appendChild(costLabel);

    const sliderValueSet = document.createElement('span');
    const minLabel = document.createElement('span');
    minLabel.textContent = '$0';
    const maxLabel = document.createElement('span');
    maxLabel.textContent = '$300';

    const costSlider = document.createElement('input');
    costSlider.type = 'range';
    costSlider.id = 'cost-slider';
    costSlider.min = 0;
    costSlider.max = 300;
    costSlider.value = 300;
    costSlider.step = 10;
    costSlider.classList.add('cost-slider');

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
    storageItem.appendChild(imageDiv);

    // pop up modal
    storageItem.addEventListener('click', () => {
      this.#showModal(item);
    })
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
    const tagsList = []
    tags.forEach(tag => tagsList.push(tag.textContent.slice(0, -1)));
    const hub = EventHub.getInstance();
    hub.publish(Events.StorageFilterRemoveTag, tagsList);
  }

  #showModal(item) {
    this.modalOverlay.innerHTML = '';
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.innerHTML = `
      <h2 class='modal-item'>${item.title}</h2>
      <img src="${item.image}"" class="modal-image modal-item"/>
      <p><strong>Duration: </strong> ${item.duration}</p>
      <p><strong>Cost: </strong> $${item.cost}</p>
      <p><strong>Size: </strong> ${item.size} sq ft</p>
      <p><strong>Contact: </strong> ${item.contact}</p>
      <p class='modal-item'><strong>Description: </strong> ${item.description}</p>
    `;
    modalContent.appendChild(modalBody);

    // render user's items 
    const userItems = document.createElement('div');
    userItems.classList.add('user-items');

    const header = document.createElement('h3');
    header.textContent = 'Your Items';
    userItems.appendChild(header);

    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    errorContainer.textContent = 'You must be logged in to view and store your items.';
    errorContainer.style.display = 'none';  
    userItems.appendChild(errorContainer);

    const itemList = document.createElement('div');
    itemList.classList.add('item-list');
    userItems.appendChild(itemList)

    const userList = this.#getUserItems();
    if (userList == null) {
      // display error div
      errorContainer.style.display = 'flex';
    } else {
      if (userList.length == 0) {
        itemList.innerHTML = '<p> No items found. </p>'
      } else {
        itemList.innerHTML = '';
        userList.forEach(item  => {
          const itemRow = this.#renderUserItems(item);
          itemList.appendChild(itemRow);
        });
      }
    }

    modalBody.appendChild(userItems);

    const modalButtons = document.createElement('span');
    modalButtons.classList.add('modal-buttons');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-modal', 'toggle', 'modal-button');
    closeButton.textContent = ' Close ';
    closeButton.addEventListener('click', () => {
      this.modalOverlay.style.display = 'none';
    });
    modalButtons.appendChild(closeButton);

    const storeButton = document.createElement('button');
    storeButton.classList.add('store-item-modal', 'toggle', 'modal-button');
    storeButton.textContent = ' Store Selected Item';
    closeButton.addEventListener('click', () => {
      const selectedItems = this.#getSelectedIds();
      selectedItems.forEach(selected => {
        const itemIndex = storedItems.findIndex(item => item.id === selected.id);
        if (itemIndex == -1) console.log("item not found");
        storedItems.splice(itemIndex, 1);
        localStorage.setItem('toStoreItem', JSON.stringify(storedItems));
      })
      this.modalOverlay.style.display = 'none';
    });
    modalButtons.appendChild(storeButton);

    modalContent.appendChild(modalButtons)
    this.modalOverlay.appendChild(modalContent);

    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) {
        this.modalOverlay.style.display = 'none';
      }
    });
    this.modalOverlay.style.display = 'flex';
  
  }

  #getUserItems() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      return null;  // User is not logged in
    }
    const toStoreItems = JSON.parse(localStorage.getItem('toStoreItem')) || [];
    return toStoreItems;
  }

  #renderUserItems(item) {
    const row = document.createElement('div');
    row.classList.add('item-row');
    row.dataset.id = item.id;

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.classList.add('item-image');
    row.appendChild(img);

    const details = document.createElement('div');
    details.classList.add('item-details');
    details.innerHTML = `
      <h2>${item.name}</h2>
      <p>${item.description}</p>
      <p>Cost: ${item.cost}</p>
      <p>Tag: ${item.tag}</p>
      <p>Delivery: ${item.delivery}</p>
      <p>Listed: ${item.listed ? 'Yes' : 'No'}</p>
    `;
    row.appendChild(details);

    const cbContainer = document.createElement('div');
    cbContainer.classList.add('item-checkbox');
    const checkbox = document.createElement('user-item-input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
      const has = this.#getSelectedIds().length > 0;
      // get the store button and change the diasble property to false
      const storeButton = document.querySelector('.store-item-modal');
      storeButton.disabled = !has;
    });
    cbContainer.appendChild(checkbox);
    row.appendChild(cbContainer);
    return row;
  }

  #getSelectedIds() {
    return Array.from(this.list.querySelectorAll('.item-row'))
      .filter(r => r.querySelector('user-item-input').checked)
      .map(r => Number(r.dataset.id));
  }

  #attachEventListeners() {
    //create a hub instance
    const hub = EventHub.getInstance();

    //storage listings
    hub.subscribe(Events.LoadStorageSuccess, (items) => {
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
    const costRangeList = {
      "S": [0, 100],
      "M": [100, 220],
      "L": [220, Infinity],
    }
    sizes.forEach(size => {
      // sizeLabel.push(size.textContent);
      size.addEventListener('click', () => {
        let selected = []
        const allBtns = this.#container.querySelectorAll('.size-group-input');
        allBtns.forEach(btn => {
          const input = btn.children[0];
          if (input.checked) {
            const currRange = costRangeList[btn.textContent[1]];
            selected.push(currRange[0]);
            selected.push(currRange[1]);
          }
        })
        if (selected.length == 0) this.state.sizeRange = [-1, -1];
        else this.state.sizeRange = [Math.min(...selected), Math.max(...selected)];
        hub.publish(Events.StorageSpaceFilter, this.state.sizeRange);
      });
    });
    

    const timeGroups = this.#container.querySelectorAll('.time-group-input');
    timeGroups.forEach(timeInput => {
      timeInput.addEventListener('click', () => {
        let selected = [];
        const allBtns = this.#container.querySelectorAll('.time-group-input');
        allBtns.forEach(btn => {
          const input = btn.children[0];
          if (input.checked) selected.push(btn.textContent.trim());
        });
        hub.publish(Events.StorageTimeFilter, selected);
      })
    })

  }
  
}