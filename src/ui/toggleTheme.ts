
export function initTheme(): void {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const body = document.body;
  
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(`${savedTheme}-theme`);
}
