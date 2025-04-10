import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class LoginComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('LoginComponent');
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('login-page');

    const loginContainer = document.createElement('div');
    loginContainer.classList.add('login-container');

    const h1 = document.createElement('h1');
    h1.textContent = 'Sign In';
    loginContainer.appendChild(h1);

    const form = document.createElement('form');
    form.id = 'login-form';

    const emailGroup = document.createElement('div');
    emailGroup.classList.add('form-group');
    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'email');
    emailLabel.textContent = 'Email Address';
    emailGroup.appendChild(emailLabel);
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.placeholder = 'Enter your email';
    emailGroup.appendChild(emailInput);
    form.appendChild(emailGroup);

    const passwordGroup = document.createElement('div');
    passwordGroup.classList.add('form-group');
    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.textContent = 'Password';
    passwordGroup.appendChild(passwordLabel);
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.placeholder = 'Enter your password';
    passwordGroup.appendChild(passwordInput);
    form.appendChild(passwordGroup);

    const signInBtn = document.createElement('button');
    signInBtn.classList.add('btn', 'btn-primary');
    signInBtn.textContent = 'Sign In';
    form.appendChild(signInBtn);

    loginContainer.appendChild(form);

    const linksDiv = document.createElement('div');
    linksDiv.classList.add('login-links');
    const forgotLink = document.createElement('a');
    forgotLink.href = '#';
    forgotLink.textContent = 'Forgot password?';
    linksDiv.appendChild(forgotLink);
    const registerLink = document.createElement('a');
    registerLink.href = '#register';
    registerLink.textContent = 'Register';
    linksDiv.appendChild(registerLink);
    loginContainer.appendChild(linksDiv);

    container.appendChild(loginContainer);
    return container;
  }
}
