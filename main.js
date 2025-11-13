// main.js — interactivité site PerrosLABX

// ======= LIGHTBOX PROJETS =======
const cards = document.querySelectorAll('.project-card');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox hidden';
lightbox.innerHTML = `
  <div class="lightbox-content">
    <button class="close">×</button>
    <div class="body"></div>
  </div>
`;
document.body.appendChild(lightbox);
const lbBody = lightbox.querySelector('.body');

cards.forEach(card => {
  card.addEventListener('click', () => {
    lbBody.innerHTML = card.innerHTML;
    lightbox.classList.remove('hidden');
  });
});

lightbox.querySelector('.close').addEventListener('click', () => lightbox.classList.add('hidden'));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.classList.add('hidden');
});

// ======= FORM VALIDATION FRONT =======
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', e => {
  const name = form.querySelector('input[type="text"]');
  const email = form.querySelector('input[type="email"]');
  const msg = form.querySelector('textarea');
  let valid = true;

  if (!name.value.trim()) { valid = false; name.style.borderColor = 'crimson'; }
  else name.style.borderColor = 'rgba(255,255,255,0.04)';

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) { valid = false; email.style.borderColor = 'crimson'; }
  else email.style.borderColor = 'rgba(255,255,255,0.04)';

  if (msg.value.trim().length < 10) { valid = false; msg.style.borderColor = 'crimson'; }
  else msg.style.borderColor = 'rgba(255,255,255,0.04)';

  if (!valid) {
    e.preventDefault();
    alert('Veuillez remplir tous les champs correctement.');
  }
});

// ===== ENVOI DU FORMULAIRE VIA BACKEND =====
form.addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const message = document.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    alert('Remplis tous les champs avant d’envoyer.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();
    if (data.success) {
      alert('✅ Message envoyé avec succès.');
      form.reset();
    } else {
      alert('⚠️ Erreur lors de l’envoi.');
    }
  } catch (err) {
    console.error(err);
    alert('❌ Impossible de contacter le serveur.');
  }
});


// ======= TIMELINE DYNAMIQUE =======
const timeline = document.createElement('section');
timeline.className = 'timeline section container';
timeline.innerHTML = `
  <h2 class="section-title">Mon apprentissage</h2>
  <div class="timeline-wrapper"></div>
`;
document.querySelector('main').appendChild(timeline);

const steps = [
  { year: '2024', skill: 'Bases réseau & Linux' },
  { year: '2025', skill: 'Cybersécurité offensive / OSCP' },
  { year: '2026', skill: 'Expertise réseau & sécurité avancée' }
];

const tlWrap = document.querySelector('.timeline-wrapper');
steps.forEach((s, i) => {
  const node = document.createElement('div');
  node.className = 'timeline-item';
  node.style.animationDelay = `${i * 0.2}s`;
  node.innerHTML = `<span class="year">${s.year}</span><span class="skill">${s.skill}</span>`;
  tlWrap.appendChild(node);
});

// ======= NAV TOGGLE =======
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open');
});

console.log('main.js chargé — aucune erreur détectée ✅');

