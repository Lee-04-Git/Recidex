import { showLoader, hideLoader } from "./components/loader.js";
import { loadHomePage } from "./pages/home.js";
import { loadFavouritesPage } from "./pages/favourites.js";
import { loadDetailPage } from "./pages/detail.js";

export class Router {
  private currentRoute: string = "";
  private currentMealId: string = "";

  init(): void {
    // Listen for hash changes
    window.addEventListener("hashchange", () => this.handleRoute());

    // Handle initial route
    this.handleRoute();
  }

  private async handleRoute(): Promise<void> {
    const hash = window.location.hash || "#/";

    console.log("Router: Navigating to", hash, "from", this.currentRoute);

    // For detail pages, also check meal ID to ensure proper loading
    if (hash.startsWith("#/meal/")) {
      const mealId = hash.replace("#/meal/", "");

      // Only skip if both route and meal ID are the same
      if (hash === this.currentRoute && mealId === this.currentMealId) {
        console.log("Router: Same detail page, skipping");
        return;
      }

      this.currentMealId = mealId;
    } else {
      // For non-detail pages, allow some reload scenarios
      if (hash === this.currentRoute) {
        // Allow reload for home page (might have different category)
        if (hash === "#/" || hash === "#/home") {
          console.log("Router: Reloading home page");
        } else {
          console.log("Router: Same route, skipping");
          return;
        }
      }

      this.currentMealId = "";
    }

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

    // Hide loader after 500ms
    setTimeout(() => {
      hideLoader();
    }, 500);
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
    console.log("Router: Manual navigation to", path);
    window.location.hash = path;
  }

  // Force reload current route
  reload(): void {
    console.log("Router: Force reloading current route");
    this.currentRoute = "";
    this.currentMealId = "";
    this.handleRoute();
  }
}
