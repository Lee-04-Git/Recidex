
import { MealAPI, type Meal } from '../api.js';
import { FavouritesStorage } from '../storage';
import { createMealCard } from '../ui/mealCard.js';
import { showLoader, hideLoader } from '../ui/loader.js';

export async function loadFavouritesPage(): Promise<void> {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div class="favourites-header">
      <h1 style="color: var(--primary-color); margin-bottom: 20px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-color)" stroke="var(--primary-color)" stroke-width="2" style="vertical-align: middle; margin-right: 8px;">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
        My Favourite Recipes
      </h1>
    </div>
    <div class="meals-grid" id="favourites-grid"></div>
  `;

  await loadFavouriteMeals();
}

async function loadFavouriteMeals(): Promise<void> {
  const favouritesGrid = document.getElementById('favourites-grid');
  if (!favouritesGrid) return;

  const favouriteIds = FavouritesStorage.getFavourites();

  if (favouriteIds.length === 0) {
    favouritesGrid.innerHTML = `
      <div class="favourites-empty-state">
        <h3>No favourite recipes yet</h3>
        <p>Start adding recipes to your favourites by clicking the heart icon!</p>
        <a href="#/" class="browse-recipes-link">
          Browse Recipes →
        </a>
      </div>
    `;
    return;
  }

  favouritesGrid.innerHTML = '<div class="loading">Loading favourite recipes...</div>';

  try {
    const meals: Meal[] = [];
    
    // Fetch all favourite meals
    for (const id of favouriteIds) {
      const meal = await MealAPI.getMealById(id);
      if (meal) {
        meals.push(meal);
      }
    }

    // Clear loading message
    favouritesGrid.innerHTML = '';

    if (meals.length === 0) {
      favouritesGrid.innerHTML = `
        <div class="favourites-empty-state">
          <h3>No favourite recipes found</h3>
          <p>Some of your favourites might have been removed from the database.</p>
        </div>
      `;
      return;
    }

    // Display favourite meals
    meals.forEach(meal => {
      const card = createMealCard(meal);
      
      // Add special styling for favourites page
      card.style.position = 'relative';
      
      // Override the favourite button to show removal with loader
      const favouriteBtn = card.querySelector('.favourite-btn') as HTMLButtonElement;
      if (favouriteBtn) {
        favouriteBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          
          // Show mini loader
          showLoader();
          
          // Remove from favourites
          FavouritesStorage.removeFavourite(meal.idMeal);
          
          // Wait for loader effect
          setTimeout(() => {
            hideLoader();
            // Remove card from DOM
            card.remove();
            
            // Check if no more favourites
            const remainingCards = favouritesGrid.querySelectorAll('.meal-card');
            if (remainingCards.length === 0) {
              favouritesGrid.innerHTML = `
                <div class="favourites-empty-state">
                  <h3>No favourite recipes yet</h3>
                  <p>Start adding recipes to your favourites by clicking the heart icon!</p>
                  <a href="#/" class="browse-recipes-link">
                    Browse Recipes →
                  </a>
                </div>
              `;
            }
          }, 500);
        });
      }
      
      favouritesGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading favourite meals:', error);
    favouritesGrid.innerHTML = `
      <div class="error-message">
        <h3>Error</h3>
        <p>Failed to load favourite recipes. Please try again.</p>
      </div>
    `;
  }
}
