const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const routePrefix = location.pathname.match(/\/(en|uz|ru)\//) ? '../' : '';
const asset = (path) => routePrefix + path;

const mobileToggle = $('[data-mobile-toggle]');
const mobilePanel = $('[data-mobile-panel]');
mobileToggle?.addEventListener('click', () => {
  const isOpen = mobilePanel.classList.toggle('is-open');
  mobileToggle.classList.toggle('is-open', isOpen);
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
});
$$('[data-mobile-panel] a').forEach((link) => {
  link.addEventListener('click', () => {
    mobilePanel?.classList.remove('is-open');
    mobileToggle?.classList.remove('is-open');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  });
});

$$('.language-switch button').forEach((button) => {
  button.addEventListener('click', () => {
    const lang = button.dataset.lang;
    if (lang) location.href = routePrefix + (lang === 'en' ? 'en/' : `${lang}/`);
  });
});

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 }) : null;
$$('.reveal').forEach((el) => revealObserver ? revealObserver.observe(el) : el.classList.add('is-visible'));

const navLinks = $$('.desktop-nav a[href^="#"]');
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => navObserver.observe(section));
}

const backToTop = $('[data-back-to-top]');
window.addEventListener('scroll', () => backToTop?.classList.toggle('is-visible', window.scrollY > 650));
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const projects = [
  ['infinity-copper-group','Infinity Copper Group','Copper processing / export','ERP ecosystem for production, warehouse, purchasing, sales and operational control.','infinity-copper-group-case-study-01.png','project-infinity-copper-group.html',['ERP','Manufacturing']],
  ['softam','Softam','Business digitalization','Internal operations and workflow digitalization for clearer management visibility.','softam-case-study-01.jpg','project-softam.html',['ERP','Website']],
  ['diran','Diran','Furniture manufacturing','Furniture production process systematization with Face ID integration context.','diran-case-study-01.png','project-diran.html',['ERP','Manufacturing']],
  ['medicom','Medicom','Medical / pharmaceutical distribution','Registration, documentation management, custom Odoo internal app and 1C integration.','medicom-case-study-01.png','project-medicom.html',['ERP','Integration']],
  ['warmix','Warmix','HVAC / website + Odoo leads','Corporate website, lead capture into Odoo and business process automation.','warmix-case-study-02.png','project-warmix.html',['Website','ERP']],
  ['fayz-oil-imports','Fayz Oil Imports','Food oil / import / export','Corporate website and product presentation for a food oil import/export brand.','fayz-oil-imports-case-study-01.png','project-fayz-oil-imports.html',['Website']],
  ['apvo','APVO','Association / event workflow','Website, Odoo event registration, email notifications and multilingual content.','apvo-case-study-01.png','project-apvo.html',['Website','ERP']],
  ['taewoong-travel','Taewoong Travel','Travel company','Website and automation solution for travel requests and service presentation.','assets/projects/taewoong-main.svg','project-taewoong-travel.html',['Website']],
  ['novikov-cafe-tashkent','Novikov Cafe Tashkent','Restaurant website','Premium restaurant website case for digital presentation and customer communication.','assets/projects/fayz-visual-2.svg','project-novikov-cafe-tashkent.html',['Website']],
  ['ftos','FTOS','Logistics','Website and automation-ready flow for logistics requests and operational communication.','ftos-case-study-01.png','project-ftos.html',['Website','Logistics']]
].map(([id,title,eyebrow,description,image,href,tags]) => ({ id,title,eyebrow,description,image,href,tags }));

const filters = ['All', 'ERP', 'Manufacturing', 'Website', 'Integration', 'Logistics'];
let activeFilter = 'All';
const grid = $('[data-project-grid]');
const filterWrap = $('[data-project-filters]');

function renderFilters() {
  if (!filterWrap) return;
  filterWrap.innerHTML = filters.map((filter) => `
    <button class="filter-btn ${filter === activeFilter ? 'is-active' : ''}" type="button" data-filter="${filter}">${filter}</button>
  `).join('');
}

function renderProjects() {
  if (!grid) return;
  const visible = projects.filter((project) => activeFilter === 'All' || project.tags.includes(activeFilter));
  grid.innerHTML = visible.map((project) => `
    <a class="project-card reveal is-visible" href="${routePrefix}${project.href}" aria-label="Open ${project.title} case study">
      <div class="project-card__image"><img src="${asset(project.image)}" alt="${project.title} case study preview" loading="lazy"></div>
      <div class="project-card__body">
        <p class="project-card__eyebrow">${project.eyebrow}</p>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <span class="project-card__link">Open case study -></span>
      </div>
    </a>
  `).join('');
}

renderFilters();
renderProjects();
filterWrap?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderProjects();
});