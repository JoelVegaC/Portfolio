// Navegación para móvil
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
}));

// Aparición de los bloques al bajar por la página
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

// Indicar en el menú la sección que estamos viendo
const sections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.querySelectorAll('a').forEach(link => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', active);
      });
    });
  }, { rootMargin: '-30% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

// Año del pie de página actualizado automáticamente
document.querySelector('#year').textContent = new Date().getFullYear();

// Abrimos las capturas en grande sin salir del portfolio.
const galleries = {
  'hotel-1': { title: 'HotelApp · Primera parte', images: [
    { src: 'hotel-sol.png', caption: 'Consulta y búsqueda de habitaciones' }
  ] },
  'hotel-2': { title: 'HotelApp · Segunda parte', images: [
    { src: 'hotel-inicio.png', caption: 'Inicio: habitaciones destacadas con tarjetas reutilizables' },
    { src: 'hotel-habitaciones.png', caption: 'Habitaciones: listado y búsqueda por número' }
  ] }
};
const gallery = document.querySelector('.gallery');
let currentGallery;
let currentImage = 0;
function showImage() {
  const item = currentGallery.images[currentImage];
  const image = gallery.querySelector('.gallery-image');
  image.src = item.src;
  image.alt = item.caption;
  gallery.querySelector('figcaption').textContent = item.caption;
  gallery.querySelector('.gallery-counter').textContent = `${currentImage + 1} / ${currentGallery.images.length}`;
}
function changeImage(direction) {
  currentImage = (currentImage + direction + currentGallery.images.length) % currentGallery.images.length;
  showImage();
}
document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => {
    currentGallery = galleries[button.dataset.gallery];
    currentImage = 0;
    gallery.querySelector('h2').textContent = currentGallery.title;
    gallery.querySelector('.gallery-controls').hidden = currentGallery.images.length === 1;
    showImage();
    gallery.showModal();
    document.body.classList.add('gallery-open');
  });
});
gallery.querySelector('.gallery-close').addEventListener('click', () => gallery.close());
gallery.querySelector('.gallery-prev').addEventListener('click', () => changeImage(-1));
gallery.querySelector('.gallery-next').addEventListener('click', () => changeImage(1));
gallery.addEventListener('close', () => document.body.classList.remove('gallery-open'));
gallery.addEventListener('click', event => {
  const bounds = gallery.getBoundingClientRect();
  if (event.target === gallery && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) gallery.close();
});
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    changeImage(event.key === 'ArrowLeft' ? -1 : 1);
  }
});
