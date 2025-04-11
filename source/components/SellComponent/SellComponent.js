import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class SellComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('SellComponent');
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('sell-page');

    const sellContainer = document.createElement('div');
    sellContainer.classList.add('sell-container');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('sell-image-container');
    const img = document.createElement('img');
    img.src = 'assets/images/placeholder.jpg'; 
    img.alt = 'Product Image';
    img.classList.add('sell-image');
    imageContainer.appendChild(img);
    sellContainer.appendChild(imageContainer);

    const details = document.createElement('div');
    details.classList.add('sell-details');

    const h2 = document.createElement('h2');
    h2.textContent = 'Sell: Coffee Table';
    details.appendChild(h2);

    const tagPriceDiv = document.createElement('div');
    tagPriceDiv.classList.add('sell-tag-price');
    const tagSpan = document.createElement('span');
    tagSpan.classList.add('sell-tag');
    tagSpan.textContent = 'Tag: Furniture';
    tagPriceDiv.appendChild(tagSpan);
    const priceSpan = document.createElement('span');
    priceSpan.classList.add('sell-price');
    priceSpan.textContent = '$0 / mo';
    tagPriceDiv.appendChild(priceSpan);
    details.appendChild(tagPriceDiv);

    const selectRow = document.createElement('div');
    selectRow.classList.add('sell-select-row');

    const contactField = document.createElement('div');
    contactField.classList.add('select-field');
    const contactLabel = document.createElement('label');
    contactLabel.setAttribute('for', 'contact');
    contactLabel.textContent = 'Contact';
    contactField.appendChild(contactLabel);
    const contactSelect = document.createElement('select');
    contactSelect.id = 'contact';
    ['Text Message', 'Option 2', 'Option 3', 'Option 4', 'Option 5'].forEach(opt => {
      const option = document.createElement('option');
      option.textContent = opt;
      contactSelect.appendChild(option);
    });
    contactField.appendChild(contactSelect);
    selectRow.appendChild(contactField);

    const deliveryField = document.createElement('div');
    deliveryField.classList.add('select-field');
    const deliveryLabel = document.createElement('label');
    deliveryLabel.setAttribute('for', 'delivery');
    deliveryLabel.textContent = 'Delivery';
    deliveryField.appendChild(deliveryLabel);
    const deliverySelect = document.createElement('select');
    deliverySelect.id = 'delivery';
    ['Can Deliver', 'Option 2', 'Option 3', 'Option 4', 'Option 5'].forEach(opt => {
      const option = document.createElement('option');
      option.textContent = opt;
      deliverySelect.appendChild(option);
    });
    deliveryField.appendChild(deliverySelect);
    selectRow.appendChild(deliveryField);

    details.appendChild(selectRow);

    const postButton = document.createElement('button');
    postButton.classList.add('btn', 'btn-neutral', 'sell-post-button');
    postButton.textContent = 'Post';
    details.appendChild(postButton);

    const accordion = document.createElement('div');
    accordion.classList.add('sell-accordion');
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item');
    const accTitle = document.createElement('div');
    accTitle.classList.add('accordion-title');
    accTitle.textContent = 'Giving away coffee table';
    accordionItem.appendChild(accTitle);
    const accContent = document.createElement('div');
    accContent.classList.add('accordion-content');
    accContent.innerHTML = 'Brown wood coffee table, minimal wear, 30” x 50”.<br>Located in Amherst downtown, can deliver if sold by 5/25/25.';
    accordionItem.appendChild(accContent);
    accordion.appendChild(accordionItem);
    details.appendChild(accordion);

    sellContainer.appendChild(details);
    container.appendChild(sellContainer);
    return container;
  }
}
