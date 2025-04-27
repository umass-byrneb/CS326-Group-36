import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class LoginComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('LoginComponent');
  }
  render() {
    const container = document.createElement('section');
    container.classList.add('login-page');
    const box = document.createElement('div');
    box.classList.add('login-container');
    const h1 = document.createElement('h1');
    h1.textContent = 'Login';
    box.appendChild(h1);

    const form = document.createElement('form');
    form.id = 'login-form';

    const makeField = (labelText, input) => {
      const grp = document.createElement('div');
      grp.classList.add('form-group');
      const lbl = document.createElement('label');
      lbl.setAttribute('for', input.id);
      lbl.textContent = labelText;
      grp.append(lbl, input);
      return grp;
    };

    const emailInput = Object.assign(document.createElement('input'), {
      type: 'email', id: 'login-email', name: 'email', placeholder: 'Enter your email'
    });
    const passwordInput = Object.assign(document.createElement('input'), {
      type: 'password', id: 'login-password', name: 'password', placeholder: 'Enter your password'
    });

    form.append(
      makeField('Email Address', emailInput),
      makeField('Password', passwordInput)
    );

    const loginBtn = document.createElement('button');
    loginBtn.type = 'button';
    loginBtn.classList.add('btn', 'btn-primary');
    loginBtn.textContent = 'Log In';
    form.appendChild(loginBtn);

    const registerLink = document.createElement('a');
    registerLink.href = '#register';
    registerLink.textContent = "Don't have an account? Register";
    box.append(form, registerLink);
    container.appendChild(box);

    loginBtn.addEventListener('click', async () => {
      const em = emailInput.value.trim();
      const pw = passwordInput.value;
      if (!em || !pw) {
        alert('Please enter email and password.');
        return;
      }
      try {
        const res = await fetch('/v1/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: em, password: pw })
        });
        let data = {};
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text(); 
          console.warn('Expected JSON but got:', text);
        }
        if (!res.ok) throw new Error(data.error || 'Login failed');
        localStorage.setItem('currentUser', JSON.stringify(data));
        form.reset();
        window.location.hash = '#user';
      } catch (err) {
        alert(err.message);
      }
    });

    return container;
  }
}
