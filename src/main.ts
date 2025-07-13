
import { Router } from './router.ts';
import { showLoader, hideLoader } from './ui/loader.js';
import { initNavbar } from './ui/navbar.js';
import { initSidebar } from './ui/sidebar.js';

class App {
  private router: Router;

  constructor() {
    this.router = new Router();
    this.init();
  }

  private async init(): Promise<void> {
    // Show loader on app start
    showLoader();

    // Initialize navbar
    initNavbar();

    // Initialize sidebar
    await initSidebar();

    // Initialize router
    this.router.init();

    // Hide loader after 1 second
    setTimeout(() => {
      hideLoader();
    }, 1000);
  }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
