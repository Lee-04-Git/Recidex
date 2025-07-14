import type { Meal } from "../api.js";
import { FavouritesStorage } from "../storage.js";

export function createMealCard(meal: Meal): HTMLElement {
  const card = document.createElement("div");
  card.className = "meal-card";

  const isFavourite = FavouritesStorage.isFavourite(meal.idMeal);

  card.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${
    meal.strMeal
  }" class="meal-card-image" loading="lazy">
    <div class="meal-card-content">
      <div class="meal-card-header">
        <h3 class="meal-card-title">${meal.strMeal}</h3>
        <button class="favourite-btn ${
          isFavourite ? "active" : ""
        }" data-meal-id="${meal.idMeal}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Add click handler for card navigation
  card.addEventListener("click", (e) => {
    // Don't navigate if clicking the favourite button
    if (
      !(e.target as HTMLElement).classList.contains("favourite-btn") &&
      !(e.target as HTMLElement).closest(".favourite-btn")
    ) {
      window.location.hash = `#/meal/${meal.idMeal}`;
    }
  });

  // Add favourite button handler
  const favouriteBtn = card.querySelector(
    ".favourite-btn"
  ) as HTMLButtonElement;
  if (favouriteBtn) {
    favouriteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavourite(meal.idMeal, favouriteBtn);
    });
  }

  return card;
}

function toggleFavourite(mealId: string, button: HTMLButtonElement): void {
  const isCurrentlyFavourite = FavouritesStorage.isFavourite(mealId);

  if (isCurrentlyFavourite) {
    FavouritesStorage.removeFavourite(mealId);
    button.classList.remove("active");
  } else {
    FavouritesStorage.addFavourite(mealId);
    button.classList.add("active");
  }
}
