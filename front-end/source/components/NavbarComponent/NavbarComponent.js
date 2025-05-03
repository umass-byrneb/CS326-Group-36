import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class NavbarComponent extends BaseComponent {
  constructor(options = {}) {
    super();
    this.options = options;
    this.loadCSS('NavbarComponent');
  }

  render() {
    const nav = document.createElement('header');
    nav.classList.add('navbar');

    const logoLink = document.createElement('a');
    logoLink.href = '#landing';
    logoLink.classList.add('logo');
    const collegeText = document.createElement('span');
    collegeText.textContent = "College";
    collegeText.classList.add('college');

    const clutterText = document.createElement('span');
    clutterText.textContent = "Clutter";
    clutterText.classList.add('clutter');

    logoLink.appendChild(collegeText);
    logoLink.appendChild(clutterText);

    nav.appendChild(logoLink);

    const navContainer = document.createElement('nav');

    if (this.options.landing) {
      const signIn = document.createElement('a');
      signIn.href = '#login';
      signIn.textContent = 'Sign in';
      navContainer.appendChild(signIn);

      const register = document.createElement('a');
      register.href = '#register';
      register.textContent = 'Register';
      navContainer.appendChild(register);
    } else {
      const links = [
        { href: '#buy', text: 'Buy' },
        { href: '#sell', text: 'Sell' },
        { href: '#storage', text: 'Storage' },
        { href: '#user', text: 'User' }
      ];
      links.forEach(linkData => {
        const a = document.createElement('a');
        a.href = linkData.href;
        a.textContent = linkData.text;
        navContainer.appendChild(a);
      });
    }

    nav.appendChild(navContainer);
    return nav;
  }
}
