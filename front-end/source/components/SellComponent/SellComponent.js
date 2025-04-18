import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class SellComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('SellComponent');
  }

  render() {
    const rawUser = localStorage.getItem('currentUser');
    const currentUser = rawUser ? JSON.parse(rawUser) : null;
    if (!currentUser) {
      const msgSection = document.createElement('section');
      msgSection.classList.add('sell-page');
      msgSection.innerHTML = `
        <div class="sell-not-logged-in">
          <p>Please <a href="#login">log in</a> before posting an item.</p>
        </div>`;
      return msgSection;
    }

    const container = document.createElement('section');
    container.classList.add('sell-page');

    const sellContainer = document.createElement('div');
    sellContainer.classList.add('sell-container');
    sellContainer.style.display = 'flex';
    sellContainer.style.gap = '2rem';

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('sell-image-container');
    imageContainer.style.display = 'flex';
    imageContainer.style.flexDirection = 'column';
    imageContainer.style.gap = '1rem';
    imageContainer.style.width = '200px';

    const img = document.createElement('img');
    img.src = 'assets/images/placeholder.jpg';
    img.alt = 'Product Image';
    img.classList.add('sell-image');
    imageContainer.appendChild(img);

    const imageUploadInput = document.createElement('input');
    imageUploadInput.type = 'file';
    imageUploadInput.accept = 'image/*';
    imageContainer.appendChild(imageUploadInput);

    const previewContainer = document.createElement('div');
    previewContainer.classList.add('sell-preview-container');
    const previewHeader = document.createElement('h3');
    previewHeader.textContent = 'Preview your selling post:';
    previewContainer.appendChild(previewHeader);
    const previewContent = document.createElement('div');
    previewContent.classList.add('preview-content');
    previewContainer.appendChild(previewContent);
    imageContainer.appendChild(previewContainer);

    imageUploadInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
          this.updatePreview(previewContent, img, {});
        };
        reader.readAsDataURL(file);
      }
    });

    sellContainer.appendChild(imageContainer);

    const details = document.createElement('div');
    details.classList.add('sell-details');
    details.style.flex = '1';
    details.style.display = 'flex';
    details.style.flexDirection = 'column';
    details.style.gap = '1rem';

    const makeField = (labelText, input) => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('input-field');
      const label = document.createElement('label');
      label.textContent = labelText;
      label.htmlFor = input.id;
      wrapper.append(label, input);
      return wrapper;
    };

    const productNameInput = Object.assign(document.createElement('input'), {
      type: 'text',
      id: 'product-name',
      placeholder: 'Enter product name',
      required: true
    });
    details.appendChild(makeField('Product Name', productNameInput));

    const tagSelect = document.createElement('select');
    tagSelect.id = 'tag';
    tagSelect.required = true;
    ['Select a Tag','Furniture','Kitchen Item','Bathroom Item','Decor','Storage','Other']
      .forEach(opt => {
        const o = document.createElement('option');
        o.textContent = opt;
        if (opt === 'Select a Tag') { o.disabled = true; o.selected = true; }
        tagSelect.appendChild(o);
      });
    details.appendChild(makeField('Tag', tagSelect));

    const costInput = Object.assign(document.createElement('input'), {
      type: 'number',
      id: 'cost',
      placeholder: 'Enter product cost',
      min: '0',
      step: '0.01',
      required: true
    });
    details.appendChild(makeField('Cost', costInput));

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '1rem';

    const contactSelect = document.createElement('select');
    contactSelect.id = 'contact';
    contactSelect.required = true;
    ['Select Contact','Only Text Message','Only Phone Number','Both']
      .forEach(opt => {
        const o = document.createElement('option');
        o.textContent = opt;
        if (opt === 'Select Contact') { o.disabled = true; o.selected = true; }
        contactSelect.appendChild(o);
      });
    row.appendChild(makeField('Contact', contactSelect));

    const deliverySelect = document.createElement('select');
    deliverySelect.id = 'delivery';
    deliverySelect.required = true;
    ['Select Delivery','Pick Up','Can Deliver']
      .forEach(opt => {
        const o = document.createElement('option');
        o.textContent = opt;
        if (opt.startsWith('Select')) { o.disabled = true; o.selected = true; }
        deliverySelect.appendChild(o);
      });
    row.appendChild(makeField('Delivery', deliverySelect));

    details.appendChild(row);

    const descInput = document.createElement('textarea');
    descInput.id = 'product-description';
    descInput.required = true;
    descInput.placeholder = 'Enter product description';
    descInput.rows = 4;
    details.appendChild(makeField('Description', descInput));

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.classList.add('btn', 'btn-primary');
    saveButton.textContent = 'Save';
    details.appendChild(saveButton);

    const updateFields = () => {
      this.updatePreview(previewContent, img, {
        name: productNameInput.value,
        tag: tagSelect.value,
        cost: costInput.value ? `$${parseFloat(costInput.value).toFixed(2)}` : '',
        contact: contactSelect.value,
        delivery: deliverySelect.value,
        description: descInput.value
      });
    };
    [productNameInput, tagSelect, costInput, contactSelect, deliverySelect, descInput]
      .forEach(el => {
        el.addEventListener('input', updateFields);
        el.addEventListener('change', updateFields);
      });

    saveButton.addEventListener('click', async () => {
      const raw = localStorage.getItem('currentUser');
      const user = raw ? JSON.parse(raw) : null;
      if (!user) {
        alert('You must be logged in to post an item.');
        window.location.hash = '#login';
        return;
      }
      if (!productNameInput.value.trim() ||
          tagSelect.selectedIndex < 1 ||
          !costInput.value ||
          contactSelect.selectedIndex < 1 ||
          deliverySelect.selectedIndex < 1 ||
          !descInput.value.trim() ||
          (!imageUploadInput.files.length && img.src.endsWith('placeholder.jpg'))
      ) {
        alert('Please fill in all fields and upload an image.');
        return;
      }
      const payload = {
        name: productNameInput.value.trim(),
        tag: tagSelect.value,
        cost: `$${parseFloat(costInput.value).toFixed(2)}`,
        contact: contactSelect.value,
        delivery: deliverySelect.value,
        description: descInput.value.trim(),
        image: img.src,
        owner: user.email,
        listed: false 
      };
      try {
        const res = await fetch('/v1/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Save failed');
        await res.json();
        alert('Item saved successfully! You can list it for sale from your dashboard.');
        window.location.hash = '#user';
      } catch (err) {
        console.error(err);
        alert('Unable to save item. Please try again.');
      }
    });

    sellContainer.appendChild(details);
    container.appendChild(sellContainer);
    return container;
  }

  updatePreview(previewContent, imgElement, fields = {}) {
    const {
      name = '',
      tag = '',
      cost = '',
      contact = '',
      delivery = '',
      description = ''
    } = fields;
    previewContent.innerHTML = `
      <div class="preview-image-container">
        <img class="preview-image" src="${imgElement.src}" alt="Preview">
      </div>
      <h2>${name || 'No name'}</h2>
      <p><strong>Tag:</strong> ${tag || '—'}</p>
      <p><strong>Cost:</strong> ${cost || '—'}</p>
      <p><strong>Contact:</strong> ${contact || '—'}</p>
      <p><strong>Delivery:</strong> ${delivery || '—'}</p>
      <p>${description || ''}</p>
    `;
  }
}
