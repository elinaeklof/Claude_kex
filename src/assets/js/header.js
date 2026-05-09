function initMobileMenu() {
  const navLinks = document.querySelector('.nav__links');
  const hamburger = document.querySelector('.nav__hamburger');

  if (!navLinks || !hamburger) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav__links--open');
    hamburger.classList.toggle('nav__hamburger--open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
});