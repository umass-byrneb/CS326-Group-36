import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class RegisterComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('RegisterComponent');
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('register-page');

    const registerContainer = document.createElement('div');
    registerContainer.classList.add('register-container');

    const h1 = document.createElement('h1');
    h1.textContent = 'Register';
    registerContainer.appendChild(h1);

    const form = document.createElement('form');
    form.id = 'register-form';

    const fullnameGroup = document.createElement('div');
    fullnameGroup.classList.add('form-group');
    const fullnameLabel = document.createElement('label');
    fullnameLabel.setAttribute('for', 'fullname');
    fullnameLabel.textContent = 'Full Name';
    fullnameGroup.appendChild(fullnameLabel);
    const fullnameInput = document.createElement('input');
    fullnameInput.type = 'text';
    fullnameInput.id = 'fullname';
    fullnameInput.name = 'fullname';
    fullnameInput.placeholder = 'Enter your full name';
    fullnameGroup.appendChild(fullnameInput);
    form.appendChild(fullnameGroup);

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
    passwordInput.placeholder = 'Enter a password';
    passwordGroup.appendChild(passwordInput);
    form.appendChild(passwordGroup);

    const confirmGroup = document.createElement('div');
    confirmGroup.classList.add('form-group');
    const confirmLabel = document.createElement('label');
    confirmLabel.setAttribute('for', 'confirm');
    confirmLabel.textContent = 'Confirm Password';
    confirmGroup.appendChild(confirmLabel);
    const confirmInput = document.createElement('input');
    confirmInput.type = 'password';
    confirmInput.id = 'confirm';
    confirmInput.name = 'confirm';
    confirmInput.placeholder = 'Re-enter your password';
    confirmGroup.appendChild(confirmInput);
    form.appendChild(confirmGroup);

    const signUpBtn = document.createElement('button');
    signUpBtn.classList.add('btn', 'btn-primary');
    signUpBtn.textContent = 'Sign Up';
    form.appendChild(signUpBtn);

    registerContainer.appendChild(form);

    const linksDiv = document.createElement('div');
    linksDiv.classList.add('register-links');
    const loginLink = document.createElement('a');
    loginLink.href = '#login';
    loginLink.textContent = 'Already have an account? Sign In';
    linksDiv.appendChild(loginLink);
    registerContainer.appendChild(linksDiv);

    container.appendChild(registerContainer);
    return container;
  }
}
