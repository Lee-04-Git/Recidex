
export function showLoader(): void {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.remove('hidden');
    document.body.classList.add('loading');
  }
}

export function hideLoader(): void {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
  }
}
