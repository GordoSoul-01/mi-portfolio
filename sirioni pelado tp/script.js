const viewer = document.querySelector('#viewer');
const viewerImage = document.querySelector('#viewer-image');
const viewerTitle = document.querySelector('#viewer-title');
let trigger;
document.querySelectorAll('.zoom').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof viewer.showModal !== 'function') return;
    event.preventDefault();
    trigger = link;
    viewerImage.src = link.href;
    viewerImage.alt = link.querySelector('img').alt;
    viewerTitle.textContent = link.dataset.caption;
    viewer.showModal();
  });
});
document.querySelector('#close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => {
  if (event.target !== viewer) return;
  const rect = viewer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
});
viewer.addEventListener('close', () => trigger?.focus());

document.querySelectorAll('.carousel').forEach(carousel => {
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const controls = carousel.querySelector('.carousel-controls');
  const status = carousel.querySelector('.carousel-status');
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      let offset = (i - current + slides.length) % slides.length;
      if (offset > slides.length / 2) offset -= slides.length;
      slide.hidden = false;
      slide.style.setProperty('--position', offset);
      slide.classList.toggle('is-current', offset === 0);
      slide.classList.toggle('is-neighbor', Math.abs(offset) === 1);
      slide.inert = offset !== 0;
      slide.setAttribute('aria-hidden', String(offset !== 0));
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'diapositiva');
      slide.setAttribute('aria-label', (i + 1) + ' de ' + slides.length);
    });
    status.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  }
  controls.hidden = false;
  carousel.classList.add('is-ready');
  controls.querySelectorAll('button').forEach(button => {
    button.textContent = Number(button.dataset.step) < 0 ? '‹' : '›';
    button.addEventListener('click', () => show(current + Number(button.dataset.step)));
  });
  carousel.addEventListener('keydown', event => {
    const keys = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const imageFocused = slides[current].contains(document.activeElement);
    show(keys[event.key]);
    if (imageFocused) slides[current].querySelector('a').focus({ preventScroll: true });
  });
  show(0);
});
