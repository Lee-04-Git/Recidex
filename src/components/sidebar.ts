import { MealAPI } from "../api.js";
import { loadHomePage } from "../pages/home.js";

let categories: any[] = [];

export async function initSidebar(): Promise<void> {
  try {
    const apiCategories = await MealAPI.getCategories();

    // Add "All" category at the beginning
    categories = [
      {
        strCategory: "All",
        strCategoryThumb: "",
        strCategoryDescription: "All recipes",
      },
      ...apiCategories,
    ];

    renderCategories();

    // Auto-select "All" category on initial load
    const allCategoryElement = document.querySelector(
      '.category-item[data-category="All"]'
    ) as HTMLElement;
    if (allCategoryElement) {
      allCategoryElement.classList.add("active");
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

function renderCategories(): void {
  const categoriesList = document.getElementById("categories-list");
  if (!categoriesList) return;

  categoriesList.innerHTML = "";

  categories.forEach((category) => {
    const categoryItem = document.createElement("div");
    categoryItem.className = "category-item";
    categoryItem.setAttribute("data-category", category.strCategory);
    categoryItem.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
      </svg>
      ${category.strCategory}
    `;

    categoryItem.addEventListener("click", () => {
      selectCategory(category.strCategory, categoryItem);
    });

    categoriesList.appendChild(categoryItem);
  });
}

function selectCategory(categoryName: string, element: HTMLElement): void {
  // Remove active class from all categories
  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Add active class to selected category
  element.classList.add("active");

  // Load meals for this category
  loadHomePage(categoryName);
}

export function clearCategorySelection(): void {
  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.remove("active");
  });
}
