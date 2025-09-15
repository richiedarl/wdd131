// Hamburger toggle
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  navLinks.classList.toggle('show');
  // Toggle X symbol
  menuButton.textContent = navLinks.classList.contains('show') ? '✖' : '☰';
});

// Footer date
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastmodified').textContent = document.lastModified;
