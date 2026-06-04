document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('productTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('counter');

  if (!track) return;

  const cards = track.querySelectorAll('.product-card');
  const total = cards.length;
  const visible = 4;
  const max = total - visible;
  const CARD_WIDTH = 250;
  const GAP = 20;
  let index = 0;

  function update() {
    track.style.transform = `translateX(-${index * (CARD_WIDTH + GAP)}px)`;
    counter.textContent = `[0${index + 1}/0${total}] →`;
    prevBtn.style.opacity = index === 0 ? '0.4' : '1';
    nextBtn.style.opacity = index >= max ? '0.4' : '1';
  }

  prevBtn.addEventListener('click', () => {
    if (index > 0) { index--; update(); }
  });

  nextBtn.addEventListener('click', () => {
    if (index < max) { index++; update(); }
  });

  update();
});
