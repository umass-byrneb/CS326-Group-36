import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class SellComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('SellComponent');
  }

  render() {
    // create indexedDB database 
    const dbPromise = indexedDB.open('productDatabase', 1); 
    dbPromise.onupgradeneeded = (event) => {
      const db = event.target.result;
            if (!db.objectStoreNames.contains('products')) {
        const objectStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false }); // Create an index on 'name'
        objectStore.createIndex('tag', 'tag', { unique: false });
        objectStore.createIndex('cost', 'cost', { unique: false });
        objectStore.createIndex('description', 'description', { unique: false });
        objectStore.createIndex('contact', 'contact', { unique: false });
        objectStore.createIndex('delivery', 'delivery', { unique: false });
        objectStore.createIndex('image', 'image', { unique: false });
      }
    };
    dbPromise.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
    };

    // create containers
    const container = document.createElement('section');
    container.classList.add('sell-page');

    const sellContainer = document.createElement('div');
    sellContainer.classList.add('sell-container');
    sellContainer.style.display = 'flex';
    sellContainer.style.flexDirection = 'row'; // puts image and form side by side
    sellContainer.style.alignItems = 'flex-start';

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('sell-image-container');
    imageContainer.style.display = 'flex'; 
    imageContainer.style.flexDirection = 'column'; 
    imageContainer.style.alignItems = 'flex-start'; // or 'center'
    imageContainer.style.marginRight = '20px'; 
    const img = document.createElement('img');

    // placeholder for image
    img.src = 'assets/images/placeholder.jpg'; 
    img.alt = 'Product Image';
    img.classList.add('sell-image');
    imageContainer.appendChild(img);
    sellContainer.appendChild(imageContainer);

    // image upload input
    const imageUploadInput = document.createElement('input');
    imageUploadInput.type = 'file';
    imageUploadInput.id = 'image-upload';
    imageUploadInput.accept = 'image/*'; // image only file types
    imageContainer.appendChild(imageUploadInput);

    // image upload event listener
    imageUploadInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result; 
        };
        reader.readAsDataURL(file);
      }
    });
    sellContainer.appendChild(imageContainer);

    // preview section 
    const previewContainer = document.createElement('div');
    previewContainer.classList.add('sell-preview-container');
    const previewHeader = document.createElement('h3');
    previewHeader.textContent = 'Preview your selling post:';
    previewContainer.appendChild(previewHeader);
    
    // elements for displaying live preview
    const previewContent = document.createElement('div');
    previewContent.classList.add('preview-content');
    previewContainer.appendChild(previewContent);
    imageContainer.appendChild(previewContainer);

    // details
    const details = document.createElement('div');
    details.classList.add('sell-details');
    details.style.flex = '1';

    // title textbox, form component
    const productNameField = document.createElement('div');
    productNameField.classList.add('input-field');
    const productNameLabel = document.createElement('label');
    productNameLabel.setAttribute('for', 'product-name');
    productNameLabel.textContent = 'Product Name';
    const productNameInput = document.createElement('input');
    productNameInput.type = 'text';
    productNameInput.id = 'product-name';
    productNameInput.required = true;
    productNameInput.placeholder = 'Enter product name';
    productNameLabel.style.display = 'block';
    productNameInput.style.display = 'block';
    productNameInput.style.marginTop = '5px';
    productNameLabel.style.fontSize = '18px';
    productNameField.appendChild(productNameLabel);
    productNameField.appendChild(productNameInput);
    details.appendChild(productNameField);

    // tag drop down, form component
    const productTag = document.createElement('div');
    productTag.classList.add('product-tag');
    const tagLabel = document.createElement('label');
    tagLabel.setAttribute('for', 'tag');
    tagLabel.textContent = 'Tag (type of product you are selling)';
    productTag.appendChild(tagLabel);
    const tagSelect = document.createElement('select');
    tagSelect.id = 'tag';
    tagSelect.required = true;
    const placeholderTag = document.createElement('option');
    placeholderTag.textContent = 'Select a Tag';
    placeholderTag.disabled = true;
    placeholderTag.selected = true;
    tagSelect.appendChild(placeholderTag);
    ['Furniture', 'Kitchen Item', 'Bathroom Item', 'Decor', 'Storage', 'Other'].forEach(opt => {
      const option = document.createElement('option');
      option.textContent = opt;
      tagSelect.appendChild(option);
    });
    productTag.style.display = 'block';
    tagSelect.style.display = 'block';
    tagSelect.style.marginTop = '5px';
    productTag.appendChild(tagSelect);
    details.appendChild(productTag);

    // cost field, form component
    const costField = document.createElement('div');
    costField.classList.add('input-field');
    const costLabel = document.createElement('label');
    costLabel.setAttribute('for', 'cost');
    costLabel.textContent = 'Cost';
    const costInput = document.createElement('input');
    costInput.type = 'number'; // numbers only
    costInput.id = 'cost';
    costInput.required = true;
    costInput.placeholder = 'Enter product cost';
    costInput.min = '0'; // 0 or greater value
    costInput.step = '0.01'; // allows dec values with 2 dec places
    costLabel.style.display = 'block';
    costInput.style.display = 'block';
    costInput.style.marginTop = '5px';
    costField.appendChild(costLabel);
    costField.appendChild(costInput);
    details.appendChild(costField);

    // allows contact + delivery to be on same row
    const selectRow = document.createElement('div');
    selectRow.classList.add('sell-select-row');

    // contact drop down, form component
    const contactField = document.createElement('div');
    contactField.classList.add('select-field');
    const contactLabel = document.createElement('label');
    contactLabel.setAttribute('for', 'contact');
    contactLabel.textContent = 'Contact';
    contactField.appendChild(contactLabel);
    const contactSelect = document.createElement('select');
    contactSelect.id = 'contact';
    contactSelect.required = true;
    const placeholderContact = document.createElement('option');
    placeholderContact.textContent = 'Select Contact Method';
    placeholderContact.disabled = true;
    placeholderContact.selected = true;
    contactSelect.appendChild(placeholderContact);
    ['Only Text Message', 'Only Phone Number', 'Both'].forEach(opt => {
      const option = document.createElement('option');
      option.textContent = opt;
      contactSelect.appendChild(option);
    });
    contactField.appendChild(contactSelect);
    selectRow.appendChild(contactField);

    // delivery drop down, form component
    const deliveryField = document.createElement('div');
    deliveryField.classList.add('select-field');
    const deliveryLabel = document.createElement('label');
    deliveryLabel.setAttribute('for', 'delivery');
    deliveryLabel.textContent = 'Delivery';
    deliveryField.appendChild(deliveryLabel);
    const deliverySelect = document.createElement('select');
    deliverySelect.id = 'delivery';
    deliverySelect.required = true;
    const placeholderDelivery = document.createElement('option');
    placeholderDelivery.textContent = 'Select Delivery Method';
    placeholderDelivery.disabled = true;
    placeholderDelivery.selected = true;
    deliverySelect.appendChild(placeholderDelivery);
    ['Can Deliver', 'Pick Up Only'].forEach(opt => {
      const option = document.createElement('option');
      option.textContent = opt;
      deliverySelect.appendChild(option);
    });
    deliveryField.appendChild(deliverySelect);
    selectRow.appendChild(deliveryField);
    details.appendChild(selectRow);

    // description text box, form component
    const productDescriptionField = document.createElement('div');
    productDescriptionField.classList.add('input-field');
    const productDescriptionLabel = document.createElement('label');
    productDescriptionLabel.setAttribute('for', 'product-description');
    productDescriptionLabel.textContent = 'Product Description';
    const productDescriptionInput = document.createElement('textarea');
    productDescriptionInput.id = 'product-description';
    productDescriptionInput.required = true;
    productDescriptionInput.placeholder = 'Enter product description'; 
    productDescriptionLabel.style.display = 'block';
    productDescriptionInput.style.display = 'block';
    productDescriptionInput.style.marginTop = '5px';
    productDescriptionInput.style.height = '150px'; 
    productDescriptionInput.style.width = '100%';
    productDescriptionField.appendChild(productDescriptionLabel);
    productDescriptionField.appendChild(productDescriptionInput);
    details.appendChild(productDescriptionField);

    //post button
    const postButton = document.createElement('button');
    postButton.classList.add('btn', 'btn-primary', 'sell-post-button');
    postButton.textContent = 'Post';
    details.appendChild(postButton);

    // post button event listener
    postButton.addEventListener('click', (e) => {
      if (!productNameInput.value || !tagSelect.value || !costInput.value || !contactSelect.value || !deliverySelect.value || !productDescriptionInput.value) { // || !img.src.includes('data:image')
        alert("Please fill in all required fields.");
        e.preventDefault(); // prevents form submission if all fields not filled
      } else {
        const productName = productNameInput.value || 'No name entered';
        const productTag = tagSelect.options[tagSelect.selectedIndex].text || 'No tag selected';
        const productCost = costInput.value ? `$${parseFloat(costInput.value).toFixed(2)}` : 'No cost entered';
        const productDescription = productDescriptionInput.value || 'No description entered';
        const contactMethod = contactSelect.options[contactSelect.selectedIndex].text || 'No contact method selected';
        const deliveryMethod = deliverySelect.options[deliverySelect.selectedIndex].text || 'No delivery method selected';
        const productImage = img.src;

        // object holding product data
        const productData = {
          name: productName,
          tag: productTag,
          cost: productCost,
          description: productDescription,
          contact: contactMethod,
          delivery: deliveryMethod,
          image: productImage,
        };
    
        // saves data to indexedDB
        saveProductToIndexedDB(productData);
        // saves data to localStorage 
        //localStorage.setItem('productData', JSON.stringify(productData));
    
        alert('Product posted successfully!');
      }
    });

    // event listener for dynamic updates in preview section
    this.updatePreview(productNameInput, tagSelect, costInput, contactSelect, deliverySelect, productDescriptionInput, previewContent, img);

    // returns final structure
    sellContainer.appendChild(details);
    container.appendChild(sellContainer);
    return container;
  }

  //function to update the preview dynamically
    updatePreview(productNameInput, tagSelect, costInput, contactSelect, deliverySelect, productDescriptionInput, previewContent, img) {
      const updatePreviewContent = () => {
        const productName = productNameInput.value || 'No name entered';
        const productTag = tagSelect.options[tagSelect.selectedIndex].text || 'No tag selected';
        const productCost = costInput.value ? `$${parseFloat(costInput.value).toFixed(2)}` : 'No cost entered';
        const productDescription = productDescriptionInput.value || 'No description entered';
        const contactMethod = contactSelect.options[contactSelect.selectedIndex].text || 'No contact method selected';
        const deliveryOption = deliverySelect.options[deliverySelect.selectedIndex].text || 'No delivery option selected';

        // img div
        const imagePreviewDiv = document.createElement('div');
        imagePreviewDiv.classList.add('preview-image-container');
        const previewImage = document.createElement('img');
        previewImage.classList.add('preview-image');
        previewImage.src = img.src.includes('data:image') ? img.src : 'assets/images/placeholder.jpg';
        imagePreviewDiv.appendChild(previewImage);

        // tag and price container
        const tagPriceDiv = document.createElement('div');
        tagPriceDiv.classList.add('sell-tag-price');
        // tag span
        const tagSpan = document.createElement('span');
        tagSpan.classList.add('sell-tag');
        tagSpan.textContent = `Tag: ${productTag}`;
        tagPriceDiv.appendChild(tagSpan);
        // price span
        const priceSpan = document.createElement('span');
        priceSpan.classList.add('sell-price');
        priceSpan.textContent = productCost;
        tagPriceDiv.appendChild(priceSpan);

        // product description accordion
        const accordion = document.createElement('div');
        accordion.classList.add('sell-accordion');
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');
        const accTitle = document.createElement('div');
        accTitle.classList.add('accordion-title');
        accTitle.textContent = 'Product Description';
        const accContent = document.createElement('div');
        accContent.classList.add('accordion-content');
        accContent.innerHTML = productDescription.replace(/\n/g, '<br>');
        accordionItem.appendChild(accTitle);
        accordionItem.appendChild(accContent);
        accordion.appendChild(accordionItem);

        // larger accordion for product details (Name, Tag, Price, Description, Contact, Delivery)
        const productDetailsAccordion = document.createElement('div');
        productDetailsAccordion.classList.add('sell-accordion');
        const productDetailsItem = document.createElement('div');
        productDetailsItem.classList.add('accordion-item');
        const productDetailsTitle = document.createElement('div');
        productDetailsTitle.classList.add('accordion-title');
        productDetailsTitle.textContent = 'Product Details';

        const productDetailsContent = document.createElement('div');
        productDetailsContent.classList.add('accordion-content');
        
        // containers for img/rest of content
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
        contentContainer.style.display = 'flex';
        contentContainer.style.alignItems = 'flex-start'; 

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.style.marginRight = '20px'; 
        imageContainer.appendChild(imagePreviewDiv);

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details-container');

        const nameHeader = document.createElement('h2');
        nameHeader.textContent = productName;
        detailsContainer.appendChild(nameHeader);
        detailsContainer.appendChild(tagPriceDiv);
        
        const contactDiv = document.createElement('div');
        contactDiv.textContent = `Contact Method: ${contactMethod}`;
        detailsContainer.appendChild(contactDiv);

        const deliveryDiv = document.createElement('div');
        deliveryDiv.textContent = `Delivery Option: ${deliveryOption}`;
        detailsContainer.appendChild(deliveryDiv);

        detailsContainer.appendChild(accordion); 
        contentContainer.appendChild(imageContainer);
        contentContainer.appendChild(detailsContainer);
        productDetailsContent.appendChild(contentContainer); 
        productDetailsItem.appendChild(productDetailsTitle);
        productDetailsItem.appendChild(productDetailsContent);
        productDetailsAccordion.appendChild(productDetailsItem);

        // set preview content
        previewContent.innerHTML = ''; // clear old content first
        previewContent.appendChild(productDetailsAccordion);

      };

      // event listeners for form fields to update preview
      productNameInput.addEventListener('input', updatePreviewContent);
      tagSelect.addEventListener('change', updatePreviewContent);
      costInput.addEventListener('input', updatePreviewContent);
      contactSelect.addEventListener('change', updatePreviewContent);
      deliverySelect.addEventListener('change', updatePreviewContent);
      productDescriptionInput.addEventListener('input', updatePreviewContent);
    }

    // function to save product data to indexedDB 
    saveProductToIndexedDB(productData) {
      dbPromise.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('products', 'readwrite');
        const objectStore = transaction.objectStore('products');
        const request = objectStore.add(productData);

        request.onsuccess = () => {
          console.log('Product added to IndexedDB:', productData);
        };

        request.onerror = (event) => {
          console.error('Error adding product to IndexedDB:', event.target.error);
        };
      };
    }

    // function to retrieve product data to indexedDB
    getAllProductsFromIndexedDB() {
      dbPromise.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction('products', 'readonly');
        const objectStore = transaction.objectStore('products');
        const request = objectStore.getAll(); 

        request.onsuccess = (event) => {
          const products = event.target.result;
          console.log('All products from IndexedDB:', products);
        };

        request.onerror = (event) => {
          console.error('Error retrieving products from IndexedDB:', event.target.error);
        };
      };
    }

    // can display products in a list
    displayProducts() {
      getAllProductsFromIndexedDB();
    }

}
