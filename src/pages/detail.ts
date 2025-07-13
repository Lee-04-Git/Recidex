
import { MealAPI } from '../api.js';
import { createMealDetail } from '../ui/mealDetail.js';

export async function loadDetailPage(mealId: string): Promise<void> {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = '<div class="loading text-center">Loading recipe details...</div>';

  try {
    const meal = await MealAPI.getMealById(mealId);
    
    if (!meal) {
      mainContent.innerHTML = `
        <div class="error-message">
          <h3>Recipe Not Found</h3>
          <p>The recipe you're looking for doesn't exist or has been removed.</p>
          <a href="#/" style="color: var(--primary-color); text-decoration: none;">
            ← Back to Home
          </a>
        </div>
      `;
      return;
    }

    const detailElement = createMealDetail(meal);
    mainContent.innerHTML = '';
    mainContent.appendChild(detailElement);

  } catch (error) {
    console.error('Error loading meal detail:', error);
    mainContent.innerHTML = `
      <div class="error-message">
        <h3>Error</h3>
        <p>Failed to load recipe details. Please try again.</p>
        <a href="#/" style="color: var(--primary-color); text-decoration: none;">
          ← Back to Home
        </a>
      </div>
    `;
  }
}
