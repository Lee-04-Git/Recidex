
export class FavouritesStorage {
  private static readonly STORAGE_KEY = 'recipe-finder-favourites';

  static getFavourites(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading favourites from storage:', error);
      return [];
    }
  }

  static addFavourite(mealId: string): void {
    try {
      const favourites = this.getFavourites();
      if (!favourites.includes(mealId)) {
        favourites.push(mealId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favourites));
      }
    } catch (error) {
      console.error('Error adding favourite to storage:', error);
    }
  }

  static removeFavourite(mealId: string): void {
    try {
      const favourites = this.getFavourites();
      const filtered = favourites.filter(id => id !== mealId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing favourite from storage:', error);
    }
  }

  static isFavourite(mealId: string): boolean {
    return this.getFavourites().includes(mealId);
  }

  static clearFavourites(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing favourites from storage:', error);
    }
  }
}
