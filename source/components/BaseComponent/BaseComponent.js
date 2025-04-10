export class BaseComponent {
    constructor() {
      this.cssLoaded = false;
    }
  
    render() {
      throw new Error('render method not implemented');
    }
  
    loadCSS(componentName) {
      if (this.cssLoaded) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      // Assumes each component’s CSS is in a folder named the same as the component
      link.href = `./components/${componentName}/${componentName}.css`;
      document.head.appendChild(link);
      this.cssLoaded = true;
    }
  }
  