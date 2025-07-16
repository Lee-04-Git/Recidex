import { MealAPI } from "../api.js";
import { loadHomePage } from "../pages/home.js";

let categories: any[] = [];
let sidebarCollapsed = true; // Start collapsed by default

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
    createToggleButton();

    // Initialize sidebar as collapsed
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    if (sidebar && mainContent) {
      sidebar.classList.add("collapsed");
      mainContent.classList.add("expanded");
    }

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

function createToggleButton(): void {
  // Remove existing toggle button if it exists
  const existingToggle = document.querySelector(".sidebar-toggle");
  if (existingToggle) {
    existingToggle.remove();
  }

  const toggleButton = document.createElement("button");
  toggleButton.className = "sidebar-toggle collapsed"; // Start with collapsed state
  toggleButton.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  `;

  toggleButton.addEventListener("click", toggleSidebar);

  // Add the toggle button to the navbar-left section, after the logo
  const navbarLeft = document.querySelector(".navbar-left");
  if (navbarLeft) {
    // Insert after the logo (append to the end of navbar-left)
    navbarLeft.appendChild(toggleButton);
  } else {
    // Fallback: create navbar-left if it doesn't exist
    const navbarContent = document.querySelector(".navbar-content");
    if (navbarContent) {
      const leftSection = document.createElement("div");
      leftSection.className = "navbar-left";

      // Move the logo to the left section first
      const logo = document.querySelector(".logo");
      if (logo) {
        leftSection.appendChild(logo);
      }

      // Then add the toggle button after the logo
      leftSection.appendChild(toggleButton);
      navbarContent.insertBefore(leftSection, navbarContent.firstChild);
    }
  }

  console.log("Sidebar toggle button created in navbar");
}

function toggleSidebar(): void {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");
  const toggleButton = document.querySelector(".sidebar-toggle");

  if (!sidebar || !mainContent || !toggleButton) return;

  sidebarCollapsed = !sidebarCollapsed;

  console.log("Toggling sidebar, collapsed:", sidebarCollapsed);

  if (sidebarCollapsed) {
    // Collapse sidebar
    sidebar.classList.add("collapsed");
    mainContent.classList.add("expanded");
    toggleButton.classList.add("collapsed");

    // Change icon to menu/open icon
    toggleButton.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    `;
  } else {
    // Expand sidebar
    sidebar.classList.remove("collapsed");
    mainContent.classList.remove("expanded");
    toggleButton.classList.remove("collapsed");

    // Change icon back to close/hamburger icon
    toggleButton.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18"/>
        <path d="M3 6h18"/>
        <path d="M3 18h18"/>
      </svg>
    `;
  }
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

// Export the toggle function for external use if needed
export function getSidebarState(): boolean {
  return sidebarCollapsed;
}

export function setSidebarState(collapsed: boolean): void {
  if (collapsed !== sidebarCollapsed) {
    toggleSidebar();
  }
}
