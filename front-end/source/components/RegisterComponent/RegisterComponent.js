import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class RegisterComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('RegisterComponent');
  }
  render() {
    const container = document.createElement('section');
    container.classList.add('register-page');
    const box = document.createElement('div');
    box.classList.add('register-container');
    const h1 = document.createElement('h1');
    h1.textContent = 'Register';
    box.appendChild(h1);

    // Form
    const form = document.createElement('form');
    form.id = 'register-form';

    const makeField = (labelText, input) => {
      const grp = document.createElement('div');
      grp.classList.add('form-group');
      const lbl = document.createElement('label');
      lbl.setAttribute('for', input.id);
      lbl.textContent = labelText;
      grp.append(lbl, input);
      return grp;
    };

    const fullnameInput = Object.assign(document.createElement('input'), {
      type: 'text', id: 'fullname', name: 'fullname', placeholder: 'Enter your full name'
    });
    const emailInput = Object.assign(document.createElement('input'), {
      type: 'email', id: 'email', name: 'email', placeholder: 'Enter your email'
    });
    const passwordInput = Object.assign(document.createElement('input'), {
      type: 'password', id: 'password', name: 'password', placeholder: 'Enter a password'
    });
    const confirmInput = Object.assign(document.createElement('input'), {
      type: 'password', id: 'confirm', name: 'confirm', placeholder: 'Confirm password'
    });

    form.append(
      makeField('Full Name', fullnameInput),
      makeField('Email Address', emailInput),
      makeField('Password', passwordInput),
      makeField('Confirm Password', confirmInput)
    );

    const signUpBtn = document.createElement('button');
    signUpBtn.type = 'button';
    signUpBtn.classList.add('btn', 'btn-neutral');
    signUpBtn.textContent = 'Sign Up';
    form.appendChild(signUpBtn);

    const linksDiv = document.createElement('div');
    linksDiv.classList.add('register-links');
    const loginLink = document.createElement('a');
    loginLink.href = '#login';
    loginLink.textContent = 'Already have an account? Sign In';
    linksDiv.appendChild(loginLink);
    box.append(form, linksDiv);
    container.appendChild(box);

    signUpBtn.addEventListener('click', async () => {
      const full = fullnameInput.value.trim();
      const em = emailInput.value.trim();
      const pw = passwordInput.value;
      const cpw = confirmInput.value;
      if (!full || !em || !pw) {
        alert('Please fill out all fields.');
        return;
      }
      if (pw !== cpw) {
        alert('Passwords do not match.');
        return;
      }
      try {
        const res = await fetch('/v1/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullname: full, email: em, password: pw })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Register failed');
        alert('Registration successful! Please log in.');
        form.reset();
        window.location.hash = '#login';
      } catch (err) {
        alert(err.message);
      }
    });

    return container;
  }
}
