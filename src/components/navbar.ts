export function initNavbar(): void {
  const favouritesBtn = document.getElementById("favourites-btn");
  const logoLink = document.querySelector(".logo");

  if (favouritesBtn) {
    favouritesBtn.addEventListener("click", () => {
      console.log("Navbar: Favourites button clicked");
      // Force navigation even if already on favourites
      const currentHash = window.location.hash;
      if (currentHash === "#/favourites") {
        // Force reload by temporarily changing hash
        window.location.hash = "#/temp";
        setTimeout(() => {
          window.location.hash = "#/favourites";
        }, 10);
      } else {
        window.location.hash = "#/favourites";
      }
    });
  }

  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Navbar: Logo clicked");
      // Force homepage reload
      const currentHash = window.location.hash;
      if (currentHash === "#/" || currentHash === "") {
        // Force reload by temporarily changing hash
        window.location.hash = "#/temp";
        setTimeout(() => {
          window.location.hash = "#/";
        }, 10);
      } else {
        window.location.hash = "#/";
      }
    });
  }

  // Create navbar-left structure if it doesn't exist
  const navbarContent = document.querySelector(".navbar-content");
  if (navbarContent && !document.querySelector(".navbar-left")) {
    const leftSection = document.createElement("div");
    leftSection.className = "navbar-left";

    // Move the logo to the left section
    const logo = document.querySelector(".logo");
    if (logo) {
      leftSection.appendChild(logo);
    }

    navbarContent.insertBefore(leftSection, navbarContent.firstChild);
  }
}
