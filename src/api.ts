
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export class MealAPI {
  static async searchByName(name: string): Promise<Meal[]> {
    try {
      const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error searching meals:', error);
      return [];
    }
  }

  static async getMealById(id: string): Promise<Meal | null> {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error('Error fetching meal by ID:', error);
      return null;
    }
  }

  static async getRandomMeal(): Promise<Meal | null> {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error('Error fetching random meal:', error);
      return null;
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  static async filterByCategory(category: string): Promise<Meal[]> {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error('Error filtering by category:', error);
      return [];
    }
  }

  static extractIngredients(meal: Meal): Array<{ingredient: string, measure: string}> {
    const ingredients: Array<{ingredient: string, measure: string}> = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    
    return ingredients;
  }
}
