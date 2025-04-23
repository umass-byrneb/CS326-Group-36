// source/components/UserComponent/UserComponent.js
import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class UserComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('UserComponent');
    this.loadedProducts = [];
  }

  render() {
    const rawUser = localStorage.getItem('currentUser');
    const currentUser = rawUser ? JSON.parse(rawUser) : null;

    // If not logged in, show prompt and no actions
    if (!currentUser) {
      const msgSection = document.createElement('section');
      msgSection.classList.add('user-page');
      msgSection.innerHTML = `
        <div class="user-not-logged-in">
          <p>Please <a href="#login">log in</a> to view your dashboard.</p>
        </div>
      `;
      return msgSection;
    }

    const container = document.createElement('section');
    container.classList.add('user-page');

    const headerBar = document.createElement('div');
    headerBar.classList.add('user-header');
    headerBar.style.display = 'flex';
    headerBar.style.justifyContent = 'space-between';
    headerBar.style.alignItems = 'center';
    headerBar.style.marginBottom = '1rem';

    const title = document.createElement('h1');
    title.classList.add('section-title');
    title.textContent = `${currentUser.fullname}'s Items`;
    headerBar.appendChild(title);

    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '0.5rem';

    const logoutBtn = document.createElement('button');
    logoutBtn.classList.add('btn', 'btn-neutral');
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.hash = '#';
    });
    btnGroup.appendChild(logoutBtn);

    const deleteProfileBtn = document.createElement('button');
    deleteProfileBtn.classList.add('btn');
    deleteProfileBtn.style.backgroundColor = '#e53e3e';
    deleteProfileBtn.style.color = '#fff';
    deleteProfileBtn.textContent = 'Delete Profile';
    deleteProfileBtn.addEventListener('click', async () => {
      if (!confirm(
        'Are you sure? This will remove your account and all items.'
      )) return;
      try {
        const res = await fetch(`/v1/users/${currentUser.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        localStorage.removeItem('currentUser');
        alert('Profile and items deleted.');
        window.location.hash = '#';
      } catch {
        alert('Error deleting profile.');
      }
    });
    btnGroup.appendChild(deleteProfileBtn);

    headerBar.appendChild(btnGroup);
    container.appendChild(headerBar);

    this.itemsList = document.createElement('div');
    this.itemsList.classList.add('items-list');
    container.appendChild(this.itemsList);

    const actions = document.createElement('div');
    actions.classList.add('user-actions');
    actions.style.marginTop = '1rem';

    const listBtn = document.createElement('button');
    listBtn.classList.add('btn', 'btn-neutral');
    listBtn.textContent = 'List Selected Items';
    listBtn.addEventListener('click', () => this.sellSelectedItems());
    actions.appendChild(listBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-neutral');
    deleteBtn.style.marginLeft = '0.5rem';
    deleteBtn.textContent = 'Delete Selected Items';
    deleteBtn.addEventListener('click', () => this.deleteSelectedItems());
    actions.appendChild(deleteBtn);

    container.appendChild(actions);

    this.loadUserProducts(currentUser);
    return container;
  }

  async loadUserProducts(currentUser) {
    this.itemsList.innerHTML = '';
    try {
      const res = await fetch('/v1/tasks');
      if (!res.ok) throw new Error();
      const { tasks } = await res.json();
      this.loadedProducts = tasks.filter(t => t.owner === currentUser.email);
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
      row.style.display = 'flex';
      row.style.gap = '1rem';
      row.style.alignItems = 'center';
      row.style.padding = '0.5rem 0';

      const img = document.createElement('img');
      img.src = prod.image;
      img.alt = prod.name;
      img.style.width = '80px';
      img.style.height = '80px';
      img.style.objectFit = 'cover';
      row.appendChild(img);

      const details = document.createElement('div');
      details.style.flex = '1';
      details.innerHTML = `
        <h2 style="margin:0">${prod.name}</h2>
        <p style="margin:0.25rem 0">Cost: ${prod.cost}</p>
        <p style="margin:0.25rem 0">Tag: ${prod.tag}</p>
        <p style="margin:0.25rem 0">Delivery: ${prod.delivery}</p>
        <p style="margin:0.25rem 0">Listed: ${prod.listed ? 'Yes' : 'No'}</p>
      `;
      row.appendChild(details);

      const cbDiv = document.createElement('div');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      cbDiv.appendChild(checkbox);
      row.appendChild(cbDiv);

      this.itemsList.appendChild(row);
    });
  }

  async sellSelectedItems() {
    const rows = Array.from(this.itemsList.querySelectorAll('.item-row'));
    const toList = rows
      .filter(r => r.querySelector('input').checked)
      .map(r => Number(r.dataset.id));
    if (!toList.length) {
      alert('Please select items to list.');
      return;
    }
    try {
      await Promise.all(toList.map(id =>
        fetch(`/v1/tasks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listed: true })
        })
      ));
      window.location.hash = '#buy';
    } catch {
      alert('Error listing items.');
    }
  }

  async deleteSelectedItems() {
    const rows = Array.from(this.itemsList.querySelectorAll('.item-row'));
    const toDelete = rows
      .filter(r => r.querySelector('input').checked)
      .map(r => Number(r.dataset.id));
    if (!toDelete.length) {
      alert('Please select items to delete.');
      return;
    }
    try {
      await Promise.all(toDelete.map(id =>
        fetch(`/v1/tasks/${id}`, { method: 'DELETE' })
      ));
      const rawUser = localStorage.getItem('currentUser');
      const user = rawUser ? JSON.parse(rawUser) : null;
      this.loadUserProducts(user);
    } catch {
      alert('Error deleting items.');
    }
  }
}
