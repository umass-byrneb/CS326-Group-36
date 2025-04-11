import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class LandingComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('LandingComponent');
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('hero');

    const h1 = document.createElement('h1');
    // h1.textContent = 'College Clutter';
    container.appendChild(h1);

    const collegeText = document.createElement('span');
    collegeText.textContent = 'College';
    collegeText.classList.add('college');
    
    const clutterText = document.createElement('span');
    clutterText.textContent = ' Clutter';
    clutterText.classList.add('clutter');

    h1.appendChild(collegeText);
    h1.appendChild(clutterText);

    const p = document.createElement('p');
    p.textContent = 'Discover affordable housing supplies.';
    container.appendChild(p);

    const btnGroup = document.createElement('div');
    btnGroup.classList.add('button-group');

    const btnBuy = document.createElement('button');
    btnBuy.classList.add('btn', 'btn-neutral');
    btnBuy.textContent = 'Buy';
    btnBuy.addEventListener('click', () => {
      window.location.hash = '#buy';
    });
    btnGroup.appendChild(btnBuy);

    const btnStorage = document.createElement('button');
    btnStorage.classList.add('btn', 'btn-neutral');
    btnStorage.textContent = 'Storage';
    btnStorage.addEventListener('click', () => {
      window.location.hash = '#storage';
    });
    btnGroup.appendChild(btnStorage);

    const btnSell = document.createElement('button');
    btnSell.classList.add('btn', 'btn-primary');
    btnSell.textContent = 'Sell';
    btnSell.addEventListener('click', () => {
      window.location.hash = '#sell';
    });
    btnGroup.appendChild(btnSell);

    container.appendChild(btnGroup);
    return container;
  }
}
