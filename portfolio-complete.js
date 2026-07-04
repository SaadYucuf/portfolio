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

const routeLangMatch = location.pathname.match(/\/(en|uz|ru)\//);
const currentLang = routeLangMatch ? routeLangMatch[1] : 'en';
const langRoute = (lang) => {
  if (lang === 'en') return routePrefix + 'en/';
  return routePrefix + `${lang}/`;
};

if (mobilePanel && !$('.mobile-language-switch', mobilePanel)) {
  const mobileLang = document.createElement('div');
  mobileLang.className = 'language-switch mobile-language-switch';
  mobileLang.setAttribute('aria-label', 'Mobile language switcher');
  mobileLang.innerHTML = '<button type="button" data-lang="en">EN</button><span></span><button type="button" data-lang="uz">UZ</button><span></span><button type="button" data-lang="ru">RU</button>';
  mobilePanel.appendChild(mobileLang);
}

$$('.language-switch button').forEach((button) => {
  const isActive = button.dataset.lang === currentLang;
  button.classList.toggle('is-active', isActive);
  button.setAttribute('aria-pressed', String(isActive));
  button.addEventListener('click', () => {
    const lang = button.dataset.lang;
    if (lang && lang !== currentLang) location.href = langRoute(lang);
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

const i18n = {
  en: {
    nav: ['About', 'Expertise', 'Projects', 'Process', 'Skills', 'Experience', 'Contact'],
    talk: "Let's Talk",
    heroPill: 'ERP / Odoo / Business Automation',
    heroTitle: 'I design and implement ERP systems that make businesses <em>work smarter.</em>',
    heroDesc: 'ERP Project Manager & Business Analyst specializing in Odoo implementation, AS-IS / TO-BE modeling, business process automation, and digital transformation across manufacturing, export, logistics, distribution, travel and consulting projects.',
    contact: 'Contact Me',
    viewProjects: 'View Projects',
    downloadCv: 'Download CV',
    best: 'What I do best',
    heroSkills: ['Odoo ERP Implementation', 'Business Process Automation', 'AS-IS / TO-BE Modeling', 'Manufacturing & Logistics Projects'],
    stats: [
      ['ERP', 'Implementation experience'],
      ['CRM', 'Business apps and automation'],
      ['AS-IS', 'Process analysis'],
      ['TO-BE', 'Workflow design']
    ],
    aboutKicker: 'About me',
    aboutTitle: 'Business logic first, <span>implementation</span> second.',
    approach: 'My Approach',
    approachItems: ['Understand the <b>real business logic</b>', 'Analyze processes and identify <b>weak points</b>', 'Design <b>AS-IS</b> and <b>TO-BE</b> processes', 'Build <b>practical and scalable</b> digital solutions', 'Deliver <b>measurable results</b>'],
    aboutText: [
      'I specialize in ERP implementation, business analysis and digital transformation. My work is focused on understanding how a company operates, identifying weak points, describing AS-IS and TO-BE processes, and turning business needs into practical digital solutions.',
      'I have worked on projects involving sales, warehouse, production, logistics, document workflow, websites and internal business automation.'
    ],
    expertiseKicker: 'Core expertise',
    expertiseTitle: 'ERP, analysis, delivery and <span>automation.</span>',
    expertiseDesc: 'A practical operating range across business discovery, requirements, project coordination, implementation support and digital presence.',
    projectsKicker: 'Projects / Case studies',
    projectsTitle: 'Selected work across ERP, websites and <span>automation.</span>',
    projectsDesc: "Each case focuses on industry context, business processes, Akbarshoh's role and practical business value without inflated claims.",
    openCase: 'Open case study ->',
    processKicker: 'Work process',
    processTitle: 'A clear path from business need to digital workflow<span>.</span>',
    processDesc: 'A proven 5-step methodology to analyze, design, and deliver ERP & automation solutions that create measurable business impact.',
    skillsKicker: 'Skills & Tools',
    skillsTitle: 'Business, project, technical and <span>AI-assisted work.</span>',
    skillsDesc: 'A summary of my experience and the tools I use to deliver business value, manage projects, solve problems and work smarter with AI.',
    experienceKicker: 'Experience',
    experienceTitle: 'ERP and transformation work with business and technical teams<span>.</span>',
    footerText: 'Helping businesses streamline operations and implement ERP solutions that drive measurable impact.',
    navTitle: 'Navigation',
    connect: 'Connect',
    together: "Let's work together",
    footerCta: "Have a project in mind?<br />I'd love to hear about it.",
    built: 'Built with focus. Designed for impact.'
  },
  uz: {
    nav: ['Men haqimda', 'Ekspertiza', 'Loyihalar', 'Jarayon', 'Ko‘nikmalar', 'Tajriba', 'Aloqa'],
    talk: 'Bog‘lanish',
    heroPill: 'ERP / Odoo / Biznes avtomatlashtirish',
    heroTitle: 'Biznes jarayonlarini <em>aniqroq va samaraliroq</em> ishlaydigan ERP tizimlarga aylantiraman.',
    heroDesc: 'ERP loyiha menejeri va Business Analyst sifatida Odoo joriy etish, AS-IS / TO-BE modellashtirish, biznes jarayonlarni avtomatlashtirish va ishlab chiqarish, eksport, logistika, distribyutsiya, travel hamda konsalting loyihalarida raqamli transformatsiya bilan ishlayman.',
    contact: 'Bog‘lanish',
    viewProjects: 'Loyihalarni ko‘rish',
    downloadCv: 'CV yuklab olish',
    best: 'Asosiy yo‘nalishlarim',
    heroSkills: ['Odoo ERP joriy etish', 'Biznes jarayonlarni avtomatlashtirish', 'AS-IS / TO-BE modellashtirish', 'Ishlab chiqarish va logistika loyihalari'],
    stats: [
      ['ERP', 'Joriy etish tajribasi'],
      ['CRM', 'Biznes ilovalar va avtomatlashtirish'],
      ['AS-IS', 'Jarayon tahlili'],
      ['TO-BE', 'Kelajak workflow dizayni']
    ],
    aboutKicker: 'Men haqimda',
    aboutTitle: 'Avval biznes logika, keyin <span>joriy etish.</span>',
    approach: 'Ishlash yondashuvim',
    approachItems: ['Haqiqiy <b>biznes logikani</b> tushunish', 'Jarayonlarni tahlil qilib <b>zaif nuqtalarni</b> topish', '<b>AS-IS</b> va <b>TO-BE</b> jarayonlarni loyihalash', '<b>Amaliy va kengayadigan</b> raqamli yechimlar qurish', '<b>O‘lchanadigan natija</b>ga yo‘naltirish'],
    aboutText: [
      'Men ERP joriy etish, biznes tahlil va raqamli transformatsiya yo‘nalishida ishlayman. Asosiy maqsadim kompaniya qanday ishlashini tushunish, zaif joylarni aniqlash, AS-IS va TO-BE jarayonlarni tasvirlash hamda biznes ehtiyojlarini amaliy raqamli yechimlarga aylantirish.',
      'Savdo, ombor, ishlab chiqarish, logistika, hujjat aylanishi, veb-saytlar va ichki biznes avtomatlashtirish loyihalarida ishlaganman.'
    ],
    expertiseKicker: 'Asosiy ekspertiza',
    expertiseTitle: 'ERP, tahlil, loyiha yetkazish va <span>avtomatlashtirish.</span>',
    expertiseDesc: 'Biznes discovery, talablar, loyiha koordinatsiyasi, joriy etish yordami va raqamli mavjudlik bo‘yicha amaliy tajriba.',
    projectsKicker: 'Loyihalar / Case study',
    projectsTitle: 'ERP, veb-sayt va <span>avtomatlashtirish</span> bo‘yicha tanlangan ishlar.',
    projectsDesc: 'Har bir case sanoat konteksti, biznes jarayonlar, mening rolim va oshirib ko‘rsatilmagan amaliy biznes qiymatiga fokus qiladi.',
    openCase: 'Case study ochish ->',
    processKicker: 'Ish jarayoni',
    processTitle: 'Biznes ehtiyojdan raqamli workflow’gacha aniq yo‘l<span>.</span>',
    processDesc: 'ERP va avtomatlashtirish yechimlarini tahlil qilish, loyihalash va yetkazish uchun 5 bosqichli amaliy metodologiya.',
    skillsKicker: 'Ko‘nikmalar va vositalar',
    skillsTitle: 'Biznes, loyiha, texnik va <span>AI yordamidagi ishlar.</span>',
    skillsDesc: 'Biznes qiymat yaratish, loyihalarni boshqarish, muammolarni hal qilish va AI bilan samaraliroq ishlashda foydalanadigan tajribam va vositalarim.',
    experienceKicker: 'Tajriba',
    experienceTitle: 'Biznes va texnik jamoalar bilan ERP hamda transformatsiya ishlari<span>.</span>',
    footerText: 'Bizneslarga operatsiyalarni tartibga solish va real ta’sir beradigan ERP yechimlarini joriy etishda yordam beraman.',
    navTitle: 'Navigatsiya',
    connect: 'Aloqa',
    together: 'Birga ishlaymiz',
    footerCta: 'Loyihangiz bormi?<br />Uni muhokama qilishdan mamnun bo‘laman.',
    built: 'Fokus bilan qurilgan. Natija uchun dizayn qilingan.'
  },
  ru: {
    nav: ['Обо мне', 'Экспертиза', 'Проекты', 'Процесс', 'Навыки', 'Опыт', 'Контакты'],
    talk: 'Связаться',
    heroPill: 'ERP / Odoo / Автоматизация бизнеса',
    heroTitle: 'Проектирую и внедряю ERP-системы, которые помогают бизнесу <em>работать эффективнее.</em>',
    heroDesc: 'ERP Project Manager и Business Analyst с опытом внедрения Odoo, моделирования AS-IS / TO-BE, автоматизации бизнес-процессов и цифровой трансформации в производстве, экспорте, логистике, дистрибуции, travel и консалтинге.',
    contact: 'Связаться',
    viewProjects: 'Смотреть проекты',
    downloadCv: 'Скачать CV',
    best: 'Ключевые направления',
    heroSkills: ['Внедрение Odoo ERP', 'Автоматизация бизнес-процессов', 'Моделирование AS-IS / TO-BE', 'Проекты производства и логистики'],
    stats: [
      ['ERP', 'Опыт внедрения'],
      ['CRM', 'Бизнес-приложения и автоматизация'],
      ['AS-IS', 'Анализ процессов'],
      ['TO-BE', 'Проектирование workflow']
    ],
    aboutKicker: 'Обо мне',
    aboutTitle: 'Сначала бизнес-логика, затем <span>внедрение.</span>',
    approach: 'Мой подход',
    approachItems: ['Понять реальную <b>бизнес-логику</b>', 'Проанализировать процессы и найти <b>слабые места</b>', 'Описать процессы <b>AS-IS</b> и <b>TO-BE</b>', 'Создавать <b>практичные и масштабируемые</b> цифровые решения', 'Фокусироваться на <b>измеримом результате</b>'],
    aboutText: [
      'Я специализируюсь на внедрении ERP, бизнес-анализе и цифровой трансформации. Моя работа начинается с понимания того, как работает компания, поиска слабых мест, описания AS-IS и TO-BE процессов и перевода бизнес-потребностей в практичные цифровые решения.',
      'Работал с проектами в продажах, складе, производстве, логистике, документообороте, веб-сайтах и внутренней автоматизации бизнеса.'
    ],
    expertiseKicker: 'Основная экспертиза',
    expertiseTitle: 'ERP, анализ, управление проектами и <span>автоматизация.</span>',
    expertiseDesc: 'Практический опыт в discovery, требованиях, координации проектов, поддержке внедрения и цифровом присутствии.',
    projectsKicker: 'Проекты / Case studies',
    projectsTitle: 'Избранные работы в ERP, сайтах и <span>автоматизации.</span>',
    projectsDesc: 'Каждый кейс показывает отраслевой контекст, бизнес-процессы, мою роль и практическую бизнес-ценность без завышенных обещаний.',
    openCase: 'Открыть case study ->',
    processKicker: 'Рабочий процесс',
    processTitle: 'Понятный путь от бизнес-потребности до цифрового workflow<span>.</span>',
    processDesc: 'Пятиэтапная методология анализа, проектирования и внедрения ERP и автоматизации с фокусом на бизнес-эффект.',
    skillsKicker: 'Навыки и инструменты',
    skillsTitle: 'Бизнес, проекты, технические инструменты и <span>работа с AI.</span>',
    skillsDesc: 'Опыт и инструменты, которые я использую для создания бизнес-ценности, управления проектами, решения задач и более эффективной работы с AI.',
    experienceKicker: 'Опыт',
    experienceTitle: 'ERP и трансформация на стыке бизнеса и технических команд<span>.</span>',
    footerText: 'Помогаю бизнесу упорядочивать операции и внедрять ERP-решения с ощутимым эффектом.',
    navTitle: 'Навигация',
    connect: 'Контакты',
    together: 'Давайте работать вместе',
    footerCta: 'Есть проект?<br />Буду рад обсудить его.',
    built: 'Сделано с фокусом. Спроектировано для результата.'
  }
};

const projectCopy = {
  uz: {
    'infinity-copper-group': ['Misni qayta ishlash / eksport', 'Ishlab chiqarish, ombor, xarid, sotuv va operatsion nazorat uchun yagona ERP ekotizimi.'],
    softam: ['Biznesni raqamlashtirish', 'Ichki operatsiyalar va workflow’larni boshqaruv uchun aniqroq ko‘rinadigan raqamli tizimga o‘tkazish.'],
    diran: ['Mebel ishlab chiqarish', 'Mebel ishlab chiqarish jarayonlarini tizimlashtirish va Face ID integratsiyasi konteksti.'],
    medicom: ['Tibbiyot / farmatsevtika distribyutsiyasi', 'Davlat ro‘yxati, hujjatlar boshqaruvi, custom Odoo ichki app va 1C integratsiyasi.'],
    warmix: ['HVAC / sayt + Odoo leadlar', 'Korporativ sayt, leadlarni Odoo’ga bog‘lash va biznes jarayonlarni avtomatlashtirish.'],
    'fayz-oil-imports': ['Oziq-ovqat moyi / import / eksport', 'Food oil import/export brendi uchun korporativ sayt va mahsulot taqdimoti.'],
    apvo: ['Assotsiatsiya / event workflow', 'Sayt, Odoo event registratsiyasi, email bildirishnomalar va ko‘p tilli kontent.'],
    'taewoong-travel': ['Travel kompaniya', 'Mijoz so‘rovlari va xizmatlarni taqdim etish uchun sayt va avtomatlashtirish yechimi.'],
    'novikov-cafe-tashkent': ['Restoran sayti', 'Premium restoran uchun digital presentation va mijoz kommunikatsiyasi sayti.'],
    ftos: ['Logistika', 'Logistika so‘rovlari va operatsion kommunikatsiya uchun website hamda automation-ready flow.']
  },
  ru: {
    'infinity-copper-group': ['Переработка меди / экспорт', 'Единая ERP-экосистема для производства, склада, закупок, продаж и операционного контроля.'],
    softam: ['Цифровизация бизнеса', 'Цифровизация внутренних операций и workflow для более прозрачного управления.'],
    diran: ['Мебельное производство', 'Систематизация производственных процессов с контекстом интеграции Face ID.'],
    medicom: ['Медицина / фармдистрибуция', 'Госрегистрация, управление документацией, внутреннее Odoo-приложение и интеграция с 1C.'],
    warmix: ['HVAC / сайт + лиды в Odoo', 'Корпоративный сайт, передача лидов в Odoo и автоматизация бизнес-процессов.'],
    'fayz-oil-imports': ['Пищевое масло / импорт / экспорт', 'Корпоративный сайт и презентация продуктов для импортно-экспортного бренда.'],
    apvo: ['Ассоциация / event workflow', 'Сайт, регистрация мероприятий в Odoo, email-уведомления и многоязычный контент.'],
    'taewoong-travel': ['Туристическая компания', 'Сайт и автоматизация для клиентских заявок и презентации услуг.'],
    'novikov-cafe-tashkent': ['Сайт ресторана', 'Премиальный сайт ресторана для digital-презентации и коммуникации с клиентами.'],
    ftos: ['Логистика', 'Сайт и automation-ready процесс для логистических заявок и операционной коммуникации.']
  }
};

function renderFilters() {
  if (!filterWrap) return;
  const labels = {
    en: { All: 'All', ERP: 'ERP', Manufacturing: 'Manufacturing', Website: 'Website', Integration: 'Integration', Logistics: 'Logistics' },
    uz: { All: 'Hammasi', ERP: 'ERP', Manufacturing: 'Ishlab chiqarish', Website: 'Website', Integration: 'Integratsiya', Logistics: 'Logistika' },
    ru: { All: 'Все', ERP: 'ERP', Manufacturing: 'Производство', Website: 'Сайты', Integration: 'Интеграция', Logistics: 'Логистика' }
  }[currentLang] || {};
  filterWrap.innerHTML = filters.map((filter) => `
    <button class="filter-btn ${filter === activeFilter ? 'is-active' : ''}" type="button" data-filter="${filter}">${labels[filter] || filter}</button>
  `).join('');
}

function renderProjects() {
  if (!grid) return;
  const visible = projects.filter((project) => activeFilter === 'All' || project.tags.includes(activeFilter));
  grid.innerHTML = visible.map((project) => `
    <a class="project-card reveal is-visible" href="${routePrefix}${project.href}" aria-label="${(i18n[currentLang] || i18n.en).openCase} ${project.title}">
      <div class="project-card__image"><img src="${asset(project.image)}" alt="${project.title} case study preview" loading="lazy"></div>
      <div class="project-card__body">
        <p class="project-card__eyebrow">${projectCopy[currentLang]?.[project.id]?.[0] || project.eyebrow}</p>
        <h3>${project.title}</h3>
        <p>${projectCopy[currentLang]?.[project.id]?.[1] || project.description}</p>
        <span class="project-card__link">${(i18n[currentLang] || i18n.en).openCase}</span>
      </div>
    </a>
  `).join('');
}

function setTexts(selector, values, mode = 'text') {
  const nodes = $$(selector);
  nodes.forEach((node, index) => {
    if (values[index] == null) return;
    if (mode === 'html') node.innerHTML = values[index];
    else node.textContent = values[index];
  });
}

function applyLanguage() {
  const t = i18n[currentLang] || i18n.en;
  document.documentElement.lang = currentLang;
  document.title = currentLang === 'uz'
    ? 'Akbarshoh Toshpolatov - ERP va Digital Transformation Consultant'
    : currentLang === 'ru'
      ? 'Akbarshoh Toshpolatov - ERP и Digital Transformation Consultant'
      : 'Akbarshoh Toshpolatov - ERP & Digital Transformation Consultant';

  setTexts('.desktop-nav a', t.nav);
  setTexts('[data-mobile-panel] a:not(.mobile-panel__cta)', t.nav);
  setTexts('.nav-cta, .mobile-panel__cta', [t.talk, t.talk]);
  $('.pill') && ($('.pill').lastChild.textContent = t.heroPill);
  $('.hero-copy h1') && ($('.hero-copy h1').innerHTML = t.heroTitle);
  $('.hero-desc p') && ($('.hero-desc p').textContent = t.heroDesc);
  setTexts('.hero-actions .btn, .hero-project-link', [t.contact, t.viewProjects, t.downloadCv, t.viewProjects]);
  $('.hero-skills strong') && ($('.hero-skills strong').textContent = t.best);
  setTexts('.hero-skills span', t.heroSkills);
  $$('.hero-stats article').forEach((card, index) => {
    if (!t.stats[index]) return;
    const strong = $('strong', card);
    const p = $('p', card);
    if (strong) strong.textContent = t.stats[index][0];
    if (p) p.textContent = t.stats[index][1];
  });

  $('#about .section-kicker') && ($('#about .section-kicker').textContent = t.aboutKicker);
  $('#about h2') && ($('#about h2').innerHTML = t.aboutTitle);
  $('.approach-title strong') && ($('.approach-title strong').textContent = t.approach);
  setTexts('.approach-card li', t.approachItems, 'html');
  setTexts('.about-text p', t.aboutText);

  $('#expertise .section-kicker') && ($('#expertise .section-kicker').textContent = t.expertiseKicker);
  $('#expertise h2') && ($('#expertise h2').innerHTML = t.expertiseTitle);
  $('#expertise .section-head > p') && ($('#expertise .section-head > p').textContent = t.expertiseDesc);
  $('#projects .section-kicker') && ($('#projects .section-kicker').textContent = t.projectsKicker);
  $('#projects h2') && ($('#projects h2').innerHTML = t.projectsTitle);
  $('#projects .section-head > p') && ($('#projects .section-head > p').textContent = t.projectsDesc);
  $('#process .section-kicker') && ($('#process .section-kicker').textContent = t.processKicker);
  $('#process h2') && ($('#process h2').innerHTML = t.processTitle);
  $('#process .process-head > p:last-child') && ($('#process .process-head > p:last-child').textContent = t.processDesc);
  $('#skills .section-kicker') && ($('#skills .section-kicker').textContent = t.skillsKicker);
  $('#skills h2') && ($('#skills h2').innerHTML = t.skillsTitle);
  $('#skills .section-head > p') && ($('#skills .section-head > p').textContent = t.skillsDesc);
  $('#experience .section-kicker') && ($('#experience .section-kicker').textContent = t.experienceKicker);
  $('#experience h2') && ($('#experience h2').innerHTML = t.experienceTitle);

  $('.footer-brand p') && ($('.footer-brand p').textContent = t.footerText);
  setTexts('.footer-nav h4, .footer-connect h4, .footer-cta h4', [t.navTitle, t.connect, t.together]);
  $('.footer-cta p') && ($('.footer-cta p').innerHTML = t.footerCta);
  $('.footer-cta .btn') && ($('.footer-cta .btn').innerHTML = `${t.talk} <span>-></span>`);
  $('.footer-cv') && ($('.footer-cv').textContent = t.downloadCv);
  $('.footer-bottom span:last-child') && ($('.footer-bottom span:last-child').textContent = t.built);
}

renderFilters();
renderProjects();
applyLanguage();
filterWrap?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  renderFilters();
  renderProjects();
  applyLanguage();
});
