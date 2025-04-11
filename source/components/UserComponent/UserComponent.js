import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class UserComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('UserComponent');
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('user-page');

    const title = document.createElement('h1');
    title.classList.add('section-title');
    title.textContent = 'My Items';
    container.appendChild(title);

    const itemsList = document.createElement('div');
    itemsList.classList.add('items-list');

    const sampleItems = [
      { title: 'Rug', description: '30" x 30" rug' },
      { title: 'Bed Frame', description: '43" x 80" metal twin bed frame' }
    ];
    sampleItems.forEach(itemData => {
      const itemRow = document.createElement('div');
      itemRow.classList.add('item-row');

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('item-image');
      itemRow.appendChild(imageDiv);

      const detailsDiv = document.createElement('div');
      detailsDiv.classList.add('item-details');
      const h2 = document.createElement('h2');
      h2.textContent = itemData.title;
      detailsDiv.appendChild(h2);
      const p = document.createElement('p');
      p.textContent = 'Description: ' + itemData.description;
      detailsDiv.appendChild(p);
      itemRow.appendChild(detailsDiv);

      const checkboxDiv = document.createElement('div');
      checkboxDiv.classList.add('item-checkbox');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkboxDiv.appendChild(checkbox);
      itemRow.appendChild(checkboxDiv);

      itemsList.appendChild(itemRow);
    });

    container.appendChild(itemsList);

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');
    buttonGroup.style.justifyContent = 'flex-end';
    const sellBtn = document.createElement('button');
    sellBtn.classList.add('btn', 'btn-neutral');
    sellBtn.textContent = 'Sell';
    const storeBtn = document.createElement('button');
    storeBtn.classList.add('btn', 'btn-neutral');
    storeBtn.textContent = 'Store';
    buttonGroup.appendChild(sellBtn);
    buttonGroup.appendChild(storeBtn);
    container.appendChild(buttonGroup);

    return container;
  }
}
