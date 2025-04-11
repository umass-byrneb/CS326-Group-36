import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class RegisterComponent extends BaseComponent {
  constructor() {
    super();
    this.loadCSS('RegisterComponent');
    this.currentStep = 0; // 0 = Personal Info, 1 = Account Details
    this.formData = {};
  }

  render() {
    this.container = document.createElement('section');
    this.container.classList.add('register-page');

    this.registerContainer = document.createElement('div');
    this.registerContainer.classList.add('register-container');

    const title = document.createElement('h1');
    title.textContent = 'Register';
    this.registerContainer.appendChild(title);

    this.form = document.createElement('form');
    this.form.id = 'register-form';

    this.renderStep();
    this.registerContainer.appendChild(this.form);

    const linksDiv = document.createElement('div');
    linksDiv.classList.add('register-links');
    const loginLink = document.createElement('a');
    loginLink.href = '#login';
    loginLink.textContent = 'Already have an account? Sign In';
    linksDiv.appendChild(loginLink);
    this.registerContainer.appendChild(linksDiv);

    this.container.appendChild(this.registerContainer);
    return this.container;
  }

  renderStep() {
    this.form.innerHTML = '';

    if (this.currentStep === 0) {
      // --- Personal Information ---
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
      if (this.formData.fullname) {
        fullnameInput.value = this.formData.fullname;
      }
      fullnameGroup.appendChild(fullnameInput);
      this.form.appendChild(fullnameGroup);

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.classList.add('btn', 'btn-primary');
      nextBtn.textContent = 'Next';
      nextBtn.addEventListener('click', () => {
        const nameValue = fullnameInput.value.trim();
        if (!nameValue) {
          alert('Please enter your full name.');
          return;
        }
        this.formData.fullname = nameValue;
        this.currentStep = 1;
        this.renderStep();
      });
      this.form.appendChild(nextBtn);

    } else if (this.currentStep === 1) {
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
      if (this.formData.email) {
        emailInput.value = this.formData.email;
      }
      emailGroup.appendChild(emailInput);
      this.form.appendChild(emailGroup);

      // Password Group
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
      this.form.appendChild(passwordGroup);

      // Confirm Password Group
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
      this.form.appendChild(confirmGroup);

      const btnContainer = document.createElement('div');
      btnContainer.classList.add('button-group');

      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.classList.add('btn', 'btn-neutral');
      backBtn.textContent = 'Back';
      backBtn.addEventListener('click', () => {
        this.currentStep = 0;
        this.renderStep();
      });
      btnContainer.appendChild(backBtn);

      const signUpBtn = document.createElement('button');
      signUpBtn.type = 'button';
      signUpBtn.classList.add('btn', 'btn-neutral');
      signUpBtn.textContent = 'Sign Up';
      signUpBtn.addEventListener('click', () => {
        // Validate the account details
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;
        const confirmValue = confirmInput.value;
        if (!emailValue || !passwordValue || !confirmValue) {
          alert('Please fill in all account details.');
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
          alert('Please enter a valid email.');
          return;
        }
        if (passwordValue !== confirmValue) {
          alert('Passwords do not match.');
          return;
        }
        if (passwordValue.length < 6) {
          alert('Password must be at least 6 characters.');
          return;
        }
        // Save data
        this.formData.email = emailValue;
        this.formData.password = passwordValue; 
        setTimeout(() => {
          alert('Registration successful!');
          this.formData = {};
          window.location.hash = '#login';
        }, 1500);
      });
      btnContainer.appendChild(signUpBtn);

      this.form.appendChild(btnContainer);
    }
  }
}
