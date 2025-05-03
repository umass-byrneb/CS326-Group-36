import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class UserComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('UserComponent');
    this.items = [];
  }

  render() {
    const raw = localStorage.getItem('currentUser');
    const user = raw ? JSON.parse(raw) : null;

    if (!user) {
      const section = document.createElement('section');
      section.classList.add('user-page');
      section.innerHTML = `
        <div class="user-not-logged-in">
          <p>Please <a href="#login">log in</a> to view your items.</p>
        </div>`;
      return section;
    }

    this.container = document.createElement('section');
    this.container.classList.add('user-page');

    const header = document.createElement('div');
    header.classList.add('user-header');

    const title = document.createElement('h1');
    title.classList.add('section-title');
    title.textContent = `${user.fullname}'s Items`;
    header.appendChild(title);

    const profileBtns = document.createElement('div');
    profileBtns.classList.add('profile-btns');

    const logoutBtn = this._createButton('Logout', 'btn-neutral', () => {
      localStorage.removeItem('currentUser');
      window.location.hash = '#';
    });
    profileBtns.appendChild(logoutBtn);

    const deleteProfileBtn = this._createButton('Delete Profile', 'btn-danger', () => {
      this._showDeleteProfileConfirm(user.id);
    });
    profileBtns.appendChild(deleteProfileBtn);

    header.appendChild(profileBtns);
    this.container.appendChild(header);

    this.errorDiv = document.createElement('div');
    this.errorDiv.classList.add('user-error');
    this.container.appendChild(this.errorDiv);

    this.list = document.createElement('div');
    this.list.classList.add('items-list');
    this.container.appendChild(this.list);

    this.btnList   = this._createButton('List Selected Items',   'btn-neutral', () => this._bulkUpdate(true));
    this.btnDelete = this._createButton('Delete Selected Items', 'btn-neutral',  () => this._bulkDelete());
    this.btnStore  = this._createButton('Store Selected Items',  'btn-neutral', () => this._storeItems());
    [this.btnList, this.btnDelete, this.btnStore].forEach(b => b.disabled = true);

    const actions = document.createElement('div');
    actions.classList.add('user-actions');
    actions.append(this.btnList, this.btnDelete, this.btnStore);
    this.container.appendChild(actions);

    this._loadItems(user.email);

    return this.container;
  }

  _createButton(text, variant, onClick) {
    const btn = document.createElement('button');
    btn.classList.add('btn', variant);
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
  }

  async _loadItems(ownerEmail) {
    this.list.innerHTML = '';
    this._clearError();
    try {
      const resp = await fetch('/v1/tasks');
      const { tasks } = await resp.json();
      this.items = tasks.filter(t => t.owner === ownerEmail);
      if (this.items.length === 0) {
        this.list.innerHTML = `<p>No items found. Please post a product.</p>`;
      } else {
        this.items.forEach(item => this._renderItemRow(item));
      }
    } catch {
      this._showError('Error loading items.');
    }
  }

  _renderItemRow(item) {
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
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => this._updateActionButtons());
    cbContainer.appendChild(checkbox);
    row.appendChild(cbContainer);

    this.list.appendChild(row);
  }

  _getSelectedIds() {
    return Array.from(this.list.querySelectorAll('.item-row'))
      .filter(r => r.querySelector('input').checked)
      .map(r => Number(r.dataset.id));
  }

  _updateActionButtons() {
    const has = this._getSelectedIds().length > 0;
    this.btnList.disabled   = !has;
    this.btnDelete.disabled = !has;
    this.btnStore.disabled  = !has;
    this._clearError();
  }

  async _bulkUpdate(listed) {
    this._clearError();
    const ids = this._getSelectedIds();
    if (!ids.length) {
      this._showError('Select at least one item to list.');
      return;
    }
    try {
      await Promise.all(ids.map(id =>
        fetch(`/v1/tasks/${id}`, {
          method: 'PUT',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ listed })
        })
      ));
      window.location.hash = listed ? '#buy' : '#user';
    } catch {
      this._showError('Failed to update items.');
    }
  }

  async _bulkDelete() {
    this._clearError();
    const ids = this._getSelectedIds();
    if (!ids.length) {
      this._showError('Select at least one item to delete.');
      return;
    }
    try {
      await Promise.all(ids.map(id =>
        fetch(`/v1/tasks/${id}`, { method: 'DELETE' })
      ));
      const user = JSON.parse(localStorage.getItem('currentUser'));
      this._loadItems(user.email);
    } catch {
      this._showError('Failed to delete items.');
    }
  }

  _storeItems() {
    this._clearError();
    const ids = this._getSelectedIds();
    if (!ids.length) {
      this._showError('Select at least one item to store.');
      return;
    }
    const selected = this.items
      .filter(item => ids.includes(item.id))
      .map(item => ({ id: item.id, name: item.name }));
    localStorage.setItem('toStoreItems', JSON.stringify(selected));
    window.location.hash = '#storage';
  }

  _showDeleteProfileConfirm(userId) {
    // remove existing overlays
    document.body.querySelectorAll('.confirmation-overlay').forEach(el => el.remove());

    const overlay = document.createElement('div');
    overlay.classList.add('confirmation-overlay');

    const box = document.createElement('div');
    box.classList.add('confirmation-box');
    box.innerHTML = `
      <h3>Delete Profile?</h3>
      <p>This will remove your account and all your items. Proceed?</p>
    `;

    const btns = document.createElement('div');
    btns.classList.add('confirm-buttons');

    const cancel = document.createElement('button');
    cancel.classList.add('btn','btn-neutral');
    cancel.textContent = 'Cancel';
    cancel.addEventListener('click', () => overlay.remove());

    const confirm = document.createElement('button');
    confirm.classList.add('btn','btn-danger');
    confirm.textContent = 'Delete';
    confirm.addEventListener('click', async () => {
      try {
        const resp = await fetch(`/v1/users/${userId}`, { method: 'DELETE' });
        if (!resp.ok) throw new Error();
        localStorage.removeItem('currentUser');
        overlay.remove();
        window.location.hash = '#';
      } catch {
        overlay.remove();
        this._showError('Failed to delete profile.');
      }
    });

    btns.append(cancel, confirm);
    box.appendChild(btns);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  _showError(msg) {
    this.errorDiv.textContent = msg;
    this.errorDiv.classList.add('visible');
  }

  _clearError() {
    this.errorDiv.textContent = '';
    this.errorDiv.classList.remove('visible');
  }
}
