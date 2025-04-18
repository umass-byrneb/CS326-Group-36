import { NavbarComponent } from './components/NavbarComponent/NavbarComponent.js';
import { LandingComponent } from './components/LandingComponent/LandingComponent.js';
import { BuyComponent } from './components/BuyComponent/BuyComponent.js';
import { SellComponent } from './components/SellComponent/SellComponent.js';
import { StorageComponent } from './components/StorageComponent/StorageComponent.js';
import { UserComponent } from './components/UserComponent/UserComponent.js';
import { LoginComponent } from './components/LoginComponent/LoginComponent.js';
import { RegisterComponent } from './components/RegisterComponent/RegisterComponent.js';
import { TaskRepositoryFactory } from './services/TaskRepositoryFactory.js';

const app = document.getElementById('app');
const taskRepo = TaskRepositoryFactory.get('remote');

function renderNavbar(isLanding) {
  const existingNav = document.querySelector('.navbar');
  if (existingNav) {
    existingNav.remove();
  }
  const navbar = new NavbarComponent({ landing: isLanding });
  app.insertBefore(navbar.render(), app.firstChild);
}

const viewContainer = document.createElement('div');
viewContainer.id = 'viewContainer';
app.appendChild(viewContainer);

function renderView(hash) {
  viewContainer.innerHTML = '';
  let component;
  let isLanding = false;
  switch (hash) {
    case '#buy':
      component = new BuyComponent();
      break;
    case '#sell':
      component = new SellComponent();
      break;
    case '#storage':
      component = new StorageComponent();
      break;
    case '#user':
      component = new UserComponent();
      break;
    case '#login':
      component = new LoginComponent();
      break;
    case '#register':
      component = new RegisterComponent();
      break;
    default:
      component = new LandingComponent();
      isLanding = true;
  }
  renderNavbar(isLanding);
  viewContainer.appendChild(component.render());
}

window.addEventListener('hashchange', () => {
  renderView(location.hash);
});

renderView(location.hash || '#landing');
