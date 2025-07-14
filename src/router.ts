import { showLoader, hideLoader } from "./components/loader.js";
import { loadHomePage } from "./pages/home.js";
import { loadFavouritesPage } from "./pages/favourites.js";
import { loadDetailPage } from "./pages/detail.js";

export class Router {
  private currentRoute: string = "";

  init(): void {
    // Listen for hash changes
    window.addEventListener("hashchange", () => this.handleRoute());

    // Handle initial route
    this.handleRoute();
  }

  private async handleRoute(): Promise<void> {
    const hash = window.location.hash || "#/";

    // Don't reload the same route
    if (hash === this.currentRoute) return;

    this.currentRoute = hash;

    // Show loader for route transitions
    showLoader();

    try {
      if (hash.startsWith("#/meal/")) {
        const mealId = hash.replace("#/meal/", "");
        await loadDetailPage(mealId);
      } else if (hash === "#/favourites") {
        await loadFavouritesPage();
      } else {
        // Default to home page
        await loadHomePage();
      }
    } catch (error) {
      console.error("Route loading error:", error);
      this.showError("Failed to load page");
    }

    // Hide loader after 1 second
    setTimeout(() => {
      hideLoader();
    }, 1000);
  }

  private showError(message: string): void {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.innerHTML = `
        <div class="error-message">
          <h3>Error</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }

  navigate(path: string): void {
    window.location.hash = path;
  }
}
