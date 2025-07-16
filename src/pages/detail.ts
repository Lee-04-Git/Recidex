import { MealAPI } from "../api.js";
import { createMealDetail } from "../components/mealDetail.js";

export async function loadDetailPage(mealId: string): Promise<void> {
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div id="detail-container" style="opacity: 0;">
      <div class="loading text-center">Loading recipe details...</div>
    </div>
  `;

  // Wait for 500ms loader, then load content
  setTimeout(async () => {
    try {
      const meal = await MealAPI.getMealById(mealId);

      const detailContainer = document.getElementById("detail-container");
      if (!detailContainer) return;

      if (!meal) {
        detailContainer.innerHTML = `
          <div class="error-message">
            <h3>Recipe Not Found</h3>
            <p>The recipe you're looking for doesn't exist or has been removed.</p>
            <a href="#/" style="color: var(--primary-color); text-decoration: none;">
              ← Back to Home
            </a>
          </div>
        `;
      } else {
        const detailElement = createMealDetail(meal);
        detailContainer.innerHTML = "";
        detailContainer.appendChild(detailElement);
      }

      // Fade in the detail container
      detailContainer.style.transition = "opacity 0.2s ease-out";
      detailContainer.style.opacity = "1";
    } catch (error) {
      console.error("Error loading meal detail:", error);
      const detailContainer = document.getElementById("detail-container");
      if (detailContainer) {
        detailContainer.innerHTML = `
          <div class="error-message">
            <h3>Error</h3>
            <p>Failed to load recipe details. Please try again.</p>
            <a href="#/" style="color: var(--primary-color); text-decoration: none;">
              ← Back to Home
            </a>
          </div>
        `;

        // Fade in even on error
        detailContainer.style.transition = "opacity 0.2s ease-out";
        detailContainer.style.opacity = "1";
      }
    }
  }, 200);
}
