import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class UserComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('UserComponent');
    this.loadedProducts = [];
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('user-page');

    const headerBar = document.createElement('div');
    headerBar.classList.add('user-header');
    headerBar.style.display = 'flex';
    headerBar.style.justifyContent = 'space-between';
    headerBar.style.alignItems = 'center';

    const rawUser = localStorage.getItem('currentUser');
    const currentUser = rawUser ? JSON.parse(rawUser) : null;

    const title = document.createElement('h1');
    title.classList.add('section-title');
    title.textContent = currentUser
      ? `${currentUser.fullname}'s Items`
      : 'My Items';
    headerBar.appendChild(title);

    const logoutBtn = document.createElement('button');
    logoutBtn.classList.add('btn', 'btn-neutral');
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.hash = '#';
    });
    headerBar.appendChild(logoutBtn);

    container.appendChild(headerBar);

    this.itemsList = document.createElement('div');
    this.itemsList.classList.add('items-list');
    container.appendChild(this.itemsList);

    const actions = document.createElement('div');
    actions.classList.add('user-actions');

    const sellBtn = document.createElement('button');
    sellBtn.classList.add('btn', 'btn-neutral');
    sellBtn.textContent = 'List Selected Items';
    sellBtn.addEventListener('click', () => this.sellSelectedItems());
    actions.appendChild(sellBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-neutral');
    deleteBtn.textContent = 'Delete Selected Items';
    deleteBtn.style.marginLeft = '0.5rem';
    deleteBtn.addEventListener('click', () => this.deleteSelectedItems());
    actions.appendChild(deleteBtn);

    container.appendChild(actions);

    this.loadUserProducts(currentUser);
    return container;
  }

  async loadUserProducts(currentUser) {
    this.itemsList.innerHTML = '';
    if (!currentUser) {
      this.itemsList.textContent = 'Please log in to see your items.';
      return;
    }
    try {
      const res = await fetch('/v1/tasks');
      const { tasks } = await res.json();
      this.loadedProducts = tasks.filter(
        t => t.owner === currentUser.email
      );
      if (!this.loadedProducts.length) {
        this.itemsList.innerHTML = '<p>No items found. Please post a product.</p>';
      } else {
        this.renderUserItems(this.loadedProducts);
      }
    } catch {
      this.itemsList.textContent = 'Error loading items.';
    }
  }

  renderUserItems(products) {
    this.itemsList.innerHTML = '';
    products.forEach(prod => {
      const row = document.createElement('div');
      row.classList.add('item-row');
      row.dataset.id = prod.id;

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('item-image');
      const img = document.createElement('img');
      img.src = prod.image;
      img.alt = prod.name;
      imgDiv.appendChild(img);
      row.appendChild(imgDiv);

      const det = document.createElement('div');
      det.classList.add('item-details');
      det.innerHTML = `
        <h2>${prod.name}</h2>
        <p>Description: ${prod.description}</p>
        <p>Cost: ${prod.cost}</p>
        <p>Tag: ${prod.tag}</p>
        <p>Contact: ${prod.contact}</p>
        <p>Delivery: ${prod.delivery}</p>
        <p>Listed: ${prod.listed ? 'Yes' : 'No'}</p>
      `;
      row.appendChild(det);

      const cbDiv = document.createElement('div');
      cbDiv.classList.add('item-checkbox');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cbDiv.appendChild(cb);
      row.appendChild(cbDiv);

      this.itemsList.appendChild(row);
    });
  }

  async sellSelectedItems() {
    const rows = Array.from(this.itemsList.querySelectorAll('.item-row'));
    const toSellIds = rows
      .filter(r => r.querySelector('input[type="checkbox"]').checked)
      .map(r => Number(r.dataset.id));

    if (!toSellIds.length) {
      alert('Please select at least one item to list.');
      return;
    }

    try {
      await Promise.all(
        toSellIds.map(id =>
          fetch(`/v1/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listed: true })
          })
        )
      );
      window.location.hash = '#buy';
    } catch (err) {
      console.error(err);
      alert('Error listing items for sale.');
    }
  }

  async deleteSelectedItems() {
    const rows = Array.from(this.itemsList.querySelectorAll('.item-row'));
    const toDelete = rows
      .filter(r => r.querySelector('input[type="checkbox"]').checked)
      .map(r => Number(r.dataset.id));

    if (!toDelete.length) {
      alert('Please select at least one item to delete.');
      return;
    }

    try {
      await Promise.all(
        toDelete.map(id =>
          fetch(`/v1/tasks/${id}`, { method: 'DELETE' })
        )
      );
      const rawUser = localStorage.getItem('currentUser');
      const user = rawUser ? JSON.parse(rawUser) : null;
      this.loadUserProducts(user);
    } catch {
      alert('Error deleting items.');
    }
  }
}
