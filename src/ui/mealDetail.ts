
import type { Meal } from '../api.js';
import { FavouritesStorage } from '../storage';

export function createMealDetail(meal: Meal): HTMLElement {
  const detailContainer = document.createElement('div');
  detailContainer.className = 'meal-detail';
  
  const isFavourite = FavouritesStorage.isFavourite(meal.idMeal);
  const ingredients = extractIngredients(meal);
  
  detailContainer.innerHTML = `
    <div class="meal-detail-header">
      <h1 class="meal-detail-title">${meal.strMeal}</h1>
      <div class="meal-detail-meta">
        <span class="meal-detail-tag">${meal.strCategory || 'Unknown Category'}</span>
        <span class="meal-detail-tag">${meal.strArea || 'Unknown Area'}</span>
      </div>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-detail-image">
      <button class="favourite-detail-btn ${isFavourite ? 'active' : ''}" data-meal-id="${meal.idMeal}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
        ${isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
      </button>
    </div>
    
    <div class="meal-detail-section">
      <h3>Ingredients</h3>
      <div class="ingredients-list">
        ${ingredients.map(ing => `<div class="ingredient-item">${ing}</div>`).join('')}
      </div>
    </div>
    
    <div class="meal-detail-section">
      <h3>Instructions</h3>
      <div class="instructions">${meal.strInstructions || 'No instructions available.'}</div>
    </div>
    
    ${meal.strYoutube ? `
      <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5,3 19,12 5,21"/>
        </svg>
        Watch on YouTube
      </a>
    ` : ''}
  `;

  // Add favourite button handler
  const favouriteBtn = detailContainer.querySelector('.favourite-detail-btn') as HTMLButtonElement;
  if (favouriteBtn) {
    favouriteBtn.addEventListener('click', () => {
      toggleDetailFavourite(meal.idMeal, favouriteBtn);
    });
  }

  return detailContainer;
}

function toggleDetailFavourite(mealId: string, button: HTMLButtonElement): void {
  const isCurrentlyFavourite = FavouritesStorage.isFavourite(mealId);
  
  if (isCurrentlyFavourite) {
    FavouritesStorage.removeFavourite(mealId);
    button.classList.remove('active');
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
      </svg>
      Add to Favourites
    `;
  } else {
    FavouritesStorage.addFavourite(mealId);
    button.classList.add('active');
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
      </svg>
      Remove from Favourites
    `;
  }
}

function extractIngredients(meal: Meal): string[] {
  const ingredients: string[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof Meal] as string;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string;
    
    if (ingredient && ingredient.trim()) {
      const measureText = measure && measure.trim() ? measure.trim() : '';
      ingredients.push(measureText ? `${measureText} ${ingredient}` : ingredient);
    }
  }
  
  return ingredients;
}
