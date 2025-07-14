
export function initNavbar(): void {
  const favouritesBtn = document.getElementById('favourites-btn');

  if (favouritesBtn) {
    favouritesBtn.addEventListener('click', () => {
      window.location.hash = '#/favourites';
    });
  }
}
