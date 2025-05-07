// source/components/LoginComponent/LoginComponent.js
import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class LoginComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('LoginComponent');
  }

  render() {
    const container = document.createElement('section');
    container.classList.add('login-page');

    this.notificationDiv = document.createElement('div');
    this.notificationDiv.classList.add('notification');
    this.notificationDiv.style.display = 'none';
    container.appendChild(this.notificationDiv);

    const box = document.createElement('div');
    box.classList.add('login-container');

    const title = document.createElement('h1');
    title.textContent = 'Login';
    box.appendChild(title);

    const form = document.createElement('form');
    form.id = 'login-form';

    const makeField = (labelText, input) => {
      const grp = document.createElement('div');
      grp.classList.add('form-group');
      const lbl = document.createElement('label');
      lbl.htmlFor = input.id;
      lbl.textContent = labelText;
      grp.append(lbl, input);
      return grp;
    };

    const emailInput = Object.assign(document.createElement('input'), {
      type: 'email',
      id: 'login-email',
      name: 'email',
      placeholder: 'Enter your email',
      required: true,
    });

    const passwordInput = Object.assign(document.createElement('input'), {
      type: 'password',
      id: 'login-password',
      name: 'password',
      placeholder: 'Enter your password',
      required: true,
    });

    form.append(
      makeField('Email Address', emailInput),
      makeField('Password', passwordInput)
    );

    const loginBtn = document.createElement('button');
    loginBtn.type = 'button';
    loginBtn.classList.add('btn', 'btn-neutral');
    loginBtn.textContent = 'Log In';
    form.appendChild(loginBtn);

    [emailInput, passwordInput].forEach(input =>
      input.addEventListener('input', () => {
        this.notificationDiv.style.display = 'none';
        this.notificationDiv.textContent = '';
      })
    );

    loginBtn.addEventListener('click', async () => {
      const em = emailInput.value.trim();
      const pw = passwordInput.value;
      if (!em || !pw) {
        this.notificationDiv.textContent = 'Please enter both email and password.';
        this.notificationDiv.style.display = 'block';
        return;
      }
      try {
        const res = await fetch('/v1/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: em, password: pw }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('currentUser', JSON.stringify(data));
        form.reset();
        window.location.hash = '#user';
      } catch (err) {
        this.notificationDiv.textContent = err.message;
        this.notificationDiv.style.display = 'block';
      }
    });

    box.appendChild(form);

    const linksDiv = document.createElement('div');
    linksDiv.classList.add('register-links');
    const registerLink = document.createElement('a');
    registerLink.href = '#register';
    registerLink.textContent = "Don't have an account? Register";
    linksDiv.appendChild(registerLink);

    box.appendChild(linksDiv);
    container.appendChild(box);

    return container;
  }
}
