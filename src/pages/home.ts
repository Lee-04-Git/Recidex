import { MealAPI, type Meal } from "../api.js";
import { createMealCard } from "../components/mealCard.js";
import { clearCategorySelection } from "../components/sidebar.js";
import { showLoader, hideLoader } from "../components/loader.js";

let searchTimeout: number;

export async function loadHomePage(category?: string): Promise<void> {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  // Clear category selection if not filtering by category
  if (!category) {
    clearCategorySelection();
  }

  mainContent.innerHTML = `
    <div class="search-container">
      <input 
        type="text" 
        id="search-input" 
        class="search-bar" 
        placeholder="Search for recipes..."
      >
    </div>
    <div id="meals-container" style="opacity: 0;">
      <div class="meals-grid" id="meals-grid">
        <div class="empty-state">
          <h3>Search for recipes above to get started</h3>
          <p>Use the search bar or select a category from the sidebar to find delicious recipes.</p>
        </div>
      </div>
    </div>
  `;

  // Setup search functionality
  const searchInput = document.getElementById(
    "search-input"
  ) as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = (e.target as HTMLInputElement).value.trim();

      // Clear existing timeout
      clearTimeout(searchTimeout);

      // Set new timeout for search
      searchTimeout = window.setTimeout(() => {
        if (query) {
          searchMeals(query);
        } else {
          // If search is empty, show empty state unless category is selected
          if (category) {
            if (category === "All") {
              loadAllMeals();
            } else {
              loadMealsByCategory(category);
            }
          } else {
            showEmptyState();
          }
        }
      }, 300);
    });
  }

  // Show loader and hide meals container initially
  showLoader();

  // Load initial content after 500ms - default to "All" category if no category specified
  setTimeout(async () => {
    const defaultCategory = category || "All";
    if (defaultCategory === "All") {
      await loadAllMeals();
    } else {
      await loadMealsByCategory(defaultCategory);
    }

    // Fade in the meals container faster
    const mealsContainer = document.getElementById("meals-container");
    if (mealsContainer) {
      mealsContainer.style.transition = "opacity 0.3s ease-out";
      mealsContainer.style.opacity = "1";
    }

    hideLoader();
  }, 100);
}

async function searchMeals(query: string): Promise<void> {
  try {
    const meals = await MealAPI.searchByName(query);
    displayMeals(meals, `Search results for "${query}"`);
  } catch (error) {
    console.error("Error searching meals:", error);
    showError("Failed to search meals");
  }
}

async function loadAllMeals(): Promise<void> {
  try {
    // Get all categories and fetch meals from each
    const categories = await MealAPI.getCategories();
    const allMealsPromises = categories.map((category) =>
      MealAPI.filterByCategory(category.strCategory)
    );

    const allMealsArrays = await Promise.all(allMealsPromises);
    const allMeals = allMealsArrays.flat();

    // Remove duplicates based on meal ID
    const uniqueMeals = allMeals.filter(
      (meal, index, self) =>
        index === self.findIndex((m) => m.idMeal === meal.idMeal)
    );

    displayMeals(uniqueMeals, "All Recipes");
  } catch (error) {
    console.error("Error loading all meals:", error);
    showError("Failed to load all meals");
  }
}

async function loadMealsByCategory(category: string): Promise<void> {
  try {
    const meals = await MealAPI.filterByCategory(category);
    displayMeals(meals, `${category} Recipes`);
  } catch (error) {
    console.error("Error loading category meals:", error);
    showError("Failed to load category meals");
  }
}

function displayMeals(meals: Meal[], title: string): void {
  const mealsGrid = document.getElementById("meals-grid");
  if (!mealsGrid) return;

  if (meals.length === 0) {
    mealsGrid.innerHTML = `
      <div class="empty-state">
        <h3>No recipes found</h3>
        <p>Try searching for something else or browse different categories.</p>
      </div>
    `;
    return;
  }

  // Add title if needed
  const container = document.getElementById("meals-container");
  if (container && title) {
    const existingTitle = container.querySelector("h2");
    if (existingTitle) {
      existingTitle.remove();
    }

    const titleElement = document.createElement("h2");
    titleElement.textContent = title;
    titleElement.style.marginBottom = "20px";
    titleElement.style.color = "var(--primary-color)";
    container.insertBefore(titleElement, mealsGrid);
  }

  // Clear and populate grid
  mealsGrid.innerHTML = "";
  meals.forEach((meal) => {
    const card = createMealCard(meal);
    mealsGrid.appendChild(card);
  });
}

function showEmptyState(): void {
  const mealsGrid = document.getElementById("meals-grid");
  if (mealsGrid) {
    mealsGrid.innerHTML = `
      <div class="empty-state">
        <h3>Search for recipes above to get started</h3>
        <p>Use the search bar or select a category from the sidebar to find delicious recipes.</p>
      </div>
    `;
  }
}

function showError(message: string): void {
  const mealsGrid = document.getElementById("meals-grid");
  if (mealsGrid) {
    mealsGrid.innerHTML = `
      <div class="error-message">
        <h3>Error</h3>
        <p>${message}</p>
      </div>
    `;
  }
}
