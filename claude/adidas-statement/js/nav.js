document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.nav-header');
  const btn = document.querySelector('.nav-hamburger');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', open);
  });
});
