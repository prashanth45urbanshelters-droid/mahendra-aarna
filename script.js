const modal = document.querySelector('#enquiryModal');
const openers = document.querySelectorAll('.open-enquiry');
const close = document.querySelector('.modal-close');

function openModal(kind = 'enquiry') {
  const isBrochure = kind === 'brochure';
  document.querySelector('#modalTitle').innerHTML = isBrochure ? 'Get the Aarna<br /><em>brochure.</em>' : 'Let’s find your<br /><em>place in Aarna.</em>';
  modal.classList.add('active', 'is-urgent');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
openers.forEach(button => button.addEventListener('click', () => openModal(button.classList.contains('brochure-trigger') ? 'brochure' : 'enquiry')));
close.addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
document.querySelector('#enquiryForm').addEventListener('submit', event => {
  event.preventDefault();
  event.currentTarget.innerHTML = '<p style="font: 500 25px/1.3 Playfair Display,serif; padding:20px 0">Thank you. Our team will be in touch shortly.</p>';
});

document.querySelectorAll('[data-quick-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const name = form.elements.name.value;
  const phone = form.elements.phone.value;
  document.querySelector('#enquiryForm input[type="text"]').value = name;
  document.querySelector('#enquiryForm input[type="tel"]').value = phone;
  openModal('enquiry');
}));

window.setTimeout(() => {
  if (!modal.classList.contains('active')) {
    document.querySelector('#modalTitle').innerHTML = 'Get complete<br /><em>Aarna details.</em>';
    modal.classList.add('active', 'is-urgent');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}, 5000);

const pullEnquiry = document.querySelector('.pull-enquiry');
let pullStartX = null;
pullEnquiry.addEventListener('pointerdown', event => {
  pullStartX = event.clientX;
  pullEnquiry.setPointerCapture(event.pointerId);
});
pullEnquiry.addEventListener('pointermove', event => {
  if (pullStartX === null) return;
  if (pullStartX - event.clientX > 36) pullEnquiry.classList.add('is-pulled');
});
pullEnquiry.addEventListener('pointerup', event => {
  const pulledFarEnough = pullStartX !== null && pullStartX - event.clientX > 58;
  pullStartX = null;
  if (pulledFarEnough) openModal('enquiry');
});
pullEnquiry.addEventListener('click', () => openModal('enquiry'));

const plans = {
  master: { image: 'assets/aarna-master-plan.jpg', alt: 'Mahendra Aarna master plan for apartments in Ananth Nagar Bangalore', kicker: '9.2 acre community', title: 'A community designed to breathe.', text: 'Six independent towers are set within landscaped grounds, shared amenities and generous open space.' },
  east: { image: 'assets/floor-plan-3bhk-east.jpg', alt: '3 BHK apartment floor plan at Mahendra Aarna in Ananth Nagar', kicker: '3 BHK · East entry', title: 'A spacious plan for every day.', text: 'An official Aarna floor-plan board. Request the brochure for complete specifications and availability.' },
  west: { image: 'assets/floor-plan-3bhk-west.jpg', alt: '3 BHK apartment floor plan at Mahendra Aarna, Electronic City Phase 2', kicker: '3 BHK · West entry', title: 'Thoughtfully arranged living.', text: 'An official Aarna floor-plan board. Request the brochure for complete specifications and availability.' }
};
document.querySelectorAll('.plan-tab').forEach(tab => tab.addEventListener('click', () => {
  const plan = plans[tab.dataset.plan];
  document.querySelectorAll('.plan-tab').forEach(item => item.classList.toggle('active', item === tab));
  Object.assign(document.querySelector('#planImage'), { src: plan.image, alt: plan.alt });
  document.querySelector('#planKicker').textContent = plan.kicker;
  document.querySelector('#planTitle').textContent = plan.title;
  document.querySelector('#planText').textContent = plan.text;
}));

const nearbyLocations = {
  offices: { type: 'OFFICES & TECH PARKS', title: 'Your workday, within reach.', text: 'A connected setting in Electronics City Phase II, with the area’s major business hubs nearby.' },
  education: { type: 'EDUCATION', title: 'A considered school run.', text: 'Schools and learning spaces are easy to access from your Ananth Nagar address.' },
  shopping: { type: 'SHOPPING & EVERYDAY NEEDS', title: 'Convenience, close by.', text: 'Retail, dining and daily essentials are part of the neighbourhood’s easy rhythm.' },
  healthcare: { type: 'HEALTHCARE', title: 'Care, when it matters.', text: 'Well-connected routes make local healthcare options comfortably accessible.' },
  transit: { type: 'PUBLIC TRANSIT', title: 'Connected in every direction.', text: 'A practical location for moving across Electronics City and the wider Bengaluru network.' }
};
document.querySelectorAll('.location-tab').forEach(tab => tab.addEventListener('click', () => {
  const item = nearbyLocations[tab.dataset.location];
  document.querySelectorAll('.location-tab').forEach(button => button.classList.toggle('active', button === tab));
  document.querySelector('#nearbyType').textContent = item.type;
  document.querySelector('#nearbyTitle').textContent = item.title;
  document.querySelector('#nearbyText').textContent = item.text;
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.13 });
  document.querySelectorAll('.reveal').forEach(section => observer.observe(section));

  const heroImage = document.querySelector('[data-parallax]');
  window.addEventListener('scroll', () => {
    const distance = window.scrollY * Number(heroImage.dataset.parallax);
    heroImage.style.transform = `translateY(${distance}px) scale(1.05)`;
  }, { passive: true });

  document.querySelectorAll('.tilt-card').forEach(card => card.addEventListener('pointermove', event => {
    if (window.innerWidth < 801) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(1100px) rotateY(${x * 3.5}deg) rotateX(${y * -3.5}deg) translateZ(4px)`;
  }));
  document.querySelectorAll('.tilt-card').forEach(card => card.addEventListener('pointerleave', () => { card.style.transform = ''; }));

  const scrollyItems = document.querySelectorAll('.stats div, .story-photo, .amenity-card, .location-experience, .seo-copy details');
  scrollyItems.forEach((item, index) => {
    item.classList.add('scrolly-item');
    item.style.setProperty('--stagger', `${Math.min(index % 5, 4) * 85}ms`);
  });
  const scrollyObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('scrolly-visible'); scrollyObserver.unobserve(entry.target); }
  }), { threshold: .14 });
  scrollyItems.forEach(item => scrollyObserver.observe(item));
}
