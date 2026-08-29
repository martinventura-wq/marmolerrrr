/**
 * AURA Marmolería & Superficies de Autor
 * JavaScript Interactivo - Calculadora, Comparador, Galería Filtrable, Modal y WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initHeader();
  initCounters();
  initScrollReveal();
  initCalculator();
  initMaterialComparator();
  initGallery();
  initFaqAccordion();
  initQuoteForm();
  initWhatsAppFloating();
});

/* ==========================================================================
   1. HEADER Y NAVEGACIÓN MOBILE
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link-item');

  // Efecto glassmorphism al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-white/95', 'shadow-md', 'py-3.5');
      header.classList.remove('bg-transparent', 'py-5');
    } else {
      header.classList.remove('bg-white/95', 'shadow-md', 'py-3.5');
      header.classList.add('bg-transparent', 'py-5');
    }
  });

  // Toggle menú mobile
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('translate-x-0');
      if (isOpen) {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
      } else {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        document.body.classList.add('overflow-hidden');
      }
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }
}

/* ==========================================================================
   2. CONTADORES ANIMADOS AL HACER SCROLL
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.stat-counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterElements.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 1800; // ms
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target.toLocaleString();
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current).toLocaleString();
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('hero-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   3. ANIMACIONES AL SCROLL (REVEAL)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. CALCULADORA Y COTIZADOR RÁPIDO INTERACTIVO
   ========================================================================== */
const MATERIAL_PRICING = {
  'granito-nacional': { name: 'Granito Nacional (Gris Mara / San Felipe)', basePrice: 180, tier: 'Económico / Alto Tránsito' },
  'granito-importado': { name: 'Granito Importado (Negro Absoluto / Vía Láctea)', basePrice: 290, tier: 'Premium Natural' },
  'marmol-carrara': { name: 'Mármol Blanco Carrara Italiano', basePrice: 340, tier: 'Lujo Clásico' },
  'marmol-travertino': { name: 'Mármol Travertino Nacional / Romano', basePrice: 270, tier: 'Lujo Cálido' },
  'cuarzo-compacto': { name: 'Cuarzo Compacto Tipo Silestone (Blanco Puro)', basePrice: 380, tier: 'Ultra Resistente' },
  'cuarcita-exotica': { name: 'Cuarcita Exótica (Patagonia / Taj Mahal)', basePrice: 520, tier: 'Exclusivo Piedra Fina' },
  'sinterizado-dekton': { name: 'Superficie Sinterizada (Tipo Dekton / Neolith)', basePrice: 480, tier: 'Tecnología Extrema' },
  'onix-translucido': { name: 'Ónix Natural Retroiluminado', basePrice: 650, tier: 'Joyería Arquitectónica' }
};

const FINISH_RATES = {
  'simple': { name: 'Borde Simple Pulido 2cm', multiplier: 1.0 },
  'regruesado': { name: 'Ingleteado / Regruesado 4cm a 45°', multiplier: 1.18 },
  'cascada': { name: 'Borde Cascada a Piso (Lateral)', multiplier: 1.35 },
  'pecho-paloma': { name: 'Pecho de Paloma / Borde Clásico', multiplier: 1.22 }
};

function initCalculator() {
  const envRadios = document.querySelectorAll('input[name="calc-space"]');
  const materialSelect = document.getElementById('calc-material');
  const metersRange = document.getElementById('calc-meters-range');
  const metersDisplay = document.getElementById('calc-meters-val');
  const finishSelect = document.getElementById('calc-finish');
  const cutoutSink = document.getElementById('calc-opt-sink');
  const cutoutCooktop = document.getElementById('calc-opt-cooktop');
  const optBacksplash = document.getElementById('calc-opt-backsplash');
  const optDrain = document.getElementById('calc-opt-drain');

  // Elementos de salida
  const priceMinEl = document.getElementById('calc-price-min');
  const priceMaxEl = document.getElementById('calc-price-max');
  const summaryMaterialEl = document.getElementById('calc-summary-material');
  const summarySpaceEl = document.getElementById('calc-summary-space');
  const summaryMetersEl = document.getElementById('calc-summary-meters');
  const summaryFinishEl = document.getElementById('calc-summary-finish');
  const summaryCutoutsEl = document.getElementById('calc-summary-cutouts');
  const whatsappCalcBtn = document.getElementById('calc-whatsapp-btn');

  function calculateQuote() {
    if (!materialSelect || !metersRange) return;

    const selectedSpace = document.querySelector('input[name="calc-space"]:checked')?.value || 'Cocina / Isla';
    const materialKey = materialSelect.value;
    const matInfo = MATERIAL_PRICING[materialKey] || MATERIAL_PRICING['granito-importado'];
    const meters = parseFloat(metersRange.value) || 3.0;
    const finishKey = finishSelect ? finishSelect.value : 'regruesado';
    const finishInfo = FINISH_RATES[finishKey] || FINISH_RATES['regruesado'];

    // Costo base por metros lineales
    let baseCost = meters * matInfo.basePrice * finishInfo.multiplier;

    // Adicionales por trasforos y artesanía
    let additionalCost = 0;
    let cutoutsSummary = [];

    if (cutoutSink && cutoutSink.checked) {
      additionalCost += 95;
      cutoutsSummary.push('Bacha bajo mesada');
    }
    if (cutoutCooktop && cutoutCooktop.checked) {
      additionalCost += 75;
      cutoutsSummary.push('Trasforo anafe');
    }
    if (optBacksplash && optBacksplash.checked) {
      additionalCost += meters * 45;
      cutoutsSummary.push('Zócalo perimetral');
    }
    if (optDrain && optDrain.checked) {
      additionalCost += 120;
      cutoutsSummary.push('Escurridor tallado en piedra');
    }

    const totalEstimate = baseCost + additionalCost;
    const minEstimate = Math.round((totalEstimate * 0.95) / 10) * 10;
    const maxEstimate = Math.round((totalEstimate * 1.10) / 10) * 10;

    // Actualizar UI
    if (priceMinEl) priceMinEl.textContent = `USD $${minEstimate.toLocaleString('en-US')}`;
    if (priceMaxEl) priceMaxEl.textContent = `USD $${maxEstimate.toLocaleString('en-US')}`;
    if (summaryMaterialEl) summaryMaterialEl.textContent = matInfo.name;
    if (summarySpaceEl) summarySpaceEl.textContent = selectedSpace;
    if (summaryMetersEl) summaryMetersEl.textContent = `${meters.toFixed(1)} metros lineales`;
    if (summaryFinishEl) summaryFinishEl.textContent = finishInfo.name;
    if (summaryCutoutsEl) {
      summaryCutoutsEl.textContent = cutoutsSummary.length > 0 ? cutoutsSummary.join(', ') : 'Corte estándar sin trasforos adicionales';
    }

    // Generar enlace dinámico para WhatsApp
    if (whatsappCalcBtn) {
      const waText = encodeURIComponent(
        `¡Hola AURA Marmolería! 👋 Estuve usando el cotizador online y me gustaría avanzar con una cotización formal:\n\n` +
        `📍 *Ambiente:* ${selectedSpace}\n` +
        `💎 *Material:* ${matInfo.name}\n` +
        `📏 *Metros lineales:* ${meters.toFixed(1)} ml\n` +
        `📐 *Terminación de borde:* ${finishInfo.name}\n` +
        `🛠️ *Adicionales:* ${cutoutsSummary.length > 0 ? cutoutsSummary.join(', ') : 'Ninguno'}\n` +
        `💵 *Estimación simulada:* USD $${minEstimate} - $${maxEstimate}\n\n` +
        `¿Podemos coordinar una visita para rectificar medidas con láser o enviarles mi plano? ¡Gracias!`
      );
      whatsappCalcBtn.href = `https://wa.me/5491155554321?text=${waText}`;
    }
  }

  // Event Listeners para recálculo instantáneo
  if (metersRange && metersDisplay) {
    metersRange.addEventListener('input', (e) => {
      metersDisplay.textContent = `${parseFloat(e.target.value).toFixed(1)} m`;
      calculateQuote();
    });
  }

  envRadios.forEach(radio => radio.addEventListener('change', calculateQuote));
  if (materialSelect) materialSelect.addEventListener('change', calculateQuote);
  if (finishSelect) finishSelect.addEventListener('change', calculateQuote);
  [cutoutSink, cutoutCooktop, optBacksplash, optDrain].forEach(cb => {
    if (cb) cb.addEventListener('change', calculateQuote);
  });

  // Cálculo inicial
  calculateQuote();
}

/* ==========================================================================
   5. COMPARADOR TÉCNICO DE MATERIALES (TABS)
   ========================================================================== */
const MATERIAL_SPECS = {
  'marmol': {
    title: 'Mármol Natural (Carrara, Marquina, Travertino)',
    subtitle: 'La piedra noble por excelencia, con vetas únicas e irrepetibles creadas por la geología.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    scores: {
      heat: 85,
      scratch: 70,
      stain: 65,
      maintenance: 'Medio / Requiere Sellado Anual',
      porosity: 'Media-Alta (Caliza metamórfica)'
    },
    idealFor: 'Baños de diseño, vanitories, hogares a leña, mesas de living, revestimientos de pared y pisos de recepción.',
    pros: [
      'Estética inigualable, fría al tacto y de altísimo valor arquitectónico.',
      'Cada tabla es una pieza de arte única e irrepetible.',
      'Admite acabados pulido brillante, apomazado satinado o envejecido.'
    ],
    cons: [
      'Sensible a ácidos (limón, vinagre, vino tinto) si no está correctamente hidrofugado.',
      'Requiere reaplicación periódica de sellador oleo-hidrófugo.'
    ]
  },
  'granito': {
    title: 'Granito Natural (Negro Absoluto, San Gabriel, Boreal)',
    subtitle: 'Roca ígnea de densidad extrema, máxima resistencia mecánica y dureza superior.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    scores: {
      heat: 98,
      scratch: 92,
      stain: 88,
      maintenance: 'Bajo / Limpieza Simple con Agua y Jabón',
      porosity: 'Baja'
    },
    idealFor: 'Mesadas de cocina de uso intensivo, quinchos, barras al aire libre y zonas de alto tránsito.',
    pros: [
      'Resiste ollas calientes apoyadas directamente sin sufrir quemaduras.',
      'Excelente resistencia al rayado con cuchillos de uso doméstico.',
      'Excelente relación costo-rendimiento y durabilidad de por vida.'
    ],
    cons: [
      'Gama de patrones más homogénea o granulada (menos vetas dramáticas que el mármol).',
      'Material pesado que requiere estructura de soporte bien aplomada.'
    ]
  },
  'cuarzo': {
    title: 'Cuarzo Compacto / Engineered Stone (Silestone, Purastone)',
    subtitle: '93% cuarzo natural combinado con resinas de alta tecnología para porosidad cero.',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    scores: {
      heat: 65,
      scratch: 88,
      stain: 98,
      maintenance: 'Nulo / Superficie Antibacteriana',
      porosity: 'Cero (Nula absorción de líquidos)'
    },
    idealFor: 'Cocinas modernas, islas integradas, bachas termo-formadas y baños de uso familiar.',
    pros: [
      'Cero absorción de líquidos: resiste café, aceite, vino y salsas sin manchar jamás.',
      'Colores totalmente homogéneos y acabados blancos puros imposibles en piedra natural.',
      'Propiedades higiénicas certificadas para contacto con alimentos.'
    ],
    cons: [
      'No resiste calor extremo directo (las resinas pueden marcarse con ollas hirviendo a más de 150°C).',
      'No apto para exteriores expuestos a rayos UV directos.'
    ]
  },
  'sinterizado': {
    title: 'Superficie Sinterizada / Ultracompacta (Dekton, Neolith)',
    subtitle: 'Minerales naturales compactados a 25.000 toneladas y horneados a 1200°C.',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    scores: {
      heat: 100,
      scratch: 98,
      stain: 100,
      maintenance: 'Nulo / Inalterable',
      porosity: 'Cero absoluto'
    },
    idealFor: 'Cocinas gourmet de vanguardia, fachadas ventiladas exteriores, pisos continuos y barbacoas.',
    pros: [
      'Inmune al fuego directo, soplete, congelación y rayos UV del sol.',
      'Se puede cortar con cuchillos directo sobre la superficie.',
      'Permite espesores ultradelgados (4mm a 20mm) de gran ligereza.'
    ],
    cons: [
      'Inversión inicial más elevada por complejidad de corte CNC waterjet.',
      'Requiere marmolistas certificados para evitar tensiones en ingletes.'
    ]
  },
  'onix': {
    title: 'Ónix Natural & Cuarcitas Exóticas (Patagonia, Esmeralda)',
    subtitle: 'Minerales semipreciosos translúcidos de impacto visual dramático y lujo escultórico.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    scores: {
      heat: 75,
      scratch: 72,
      stain: 70,
      maintenance: 'Alto / Cuidado Exclusivo',
      porosity: 'Media'
    },
    idealFor: 'Barras de tragos retroiluminadas con LED, paredes focales de living, vanitories boutique y suites.',
    pros: [
      'Permite retroiluminación LED trasera transformando el ambiente por la noche.',
      'Piezas de colección catalogadas como gemas geológicas.',
      'Valorización inmediata de la propiedad inmobiliaria.'
    ],
    cons: [
      'Material delicado que exige mantenimiento preventivo y limpieza con productos neutros.',
      'Costo de extracción y procesamiento de nivel joyero.'
    ]
  }
};

function initMaterialComparator() {
  const tabs = document.querySelectorAll('.comp-tab-btn');
  const titleEl = document.getElementById('comp-title');
  const subtitleEl = document.getElementById('comp-subtitle');
  const imgEl = document.getElementById('comp-img');
  const barHeat = document.getElementById('comp-bar-heat');
  const barScratch = document.getElementById('comp-bar-scratch');
  const barStain = document.getElementById('comp-bar-stain');
  const valHeat = document.getElementById('comp-val-heat');
  const valScratch = document.getElementById('comp-val-scratch');
  const valStain = document.getElementById('comp-val-stain');
  const maintenanceEl = document.getElementById('comp-maintenance');
  const porosityEl = document.getElementById('comp-porosity');
  const idealForEl = document.getElementById('comp-ideal');
  const prosListEl = document.getElementById('comp-pros-list');
  const consListEl = document.getElementById('comp-cons-list');

  function renderMaterial(key) {
    const data = MATERIAL_SPECS[key];
    if (!data) return;

    if (titleEl) titleEl.textContent = data.title;
    if (subtitleEl) subtitleEl.textContent = data.subtitle;
    if (imgEl) {
      imgEl.src = data.image;
      imgEl.alt = data.title;
    }

    if (barHeat) barHeat.style.width = `${data.scores.heat}%`;
    if (valHeat) valHeat.textContent = `${data.scores.heat}%`;

    if (barScratch) barScratch.style.width = `${data.scores.scratch}%`;
    if (valScratch) valScratch.textContent = `${data.scores.scratch}%`;

    if (barStain) barStain.style.width = `${data.scores.stain}%`;
    if (valStain) valStain.textContent = `${data.scores.stain}%`;

    if (maintenanceEl) maintenanceEl.textContent = data.scores.maintenance;
    if (porosityEl) porosityEl.textContent = data.scores.porosity;
    if (idealForEl) idealForEl.textContent = data.idealFor;

    if (prosListEl) {
      prosListEl.innerHTML = data.pros.map(pro => `
        <li class="flex items-start gap-2.5 text-sm text-stone-700">
          <span class="text-emerald-700 font-bold mt-0.5">✓</span>
          <span>${pro}</span>
        </li>
      `).join('');
    }

    if (consListEl) {
      consListEl.innerHTML = data.cons.map(con => `
        <li class="flex items-start gap-2.5 text-sm text-stone-600">
          <span class="text-amber-700 font-bold mt-0.5">!</span>
          <span>${con}</span>
        </li>
      `).join('');
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-[#121417]', 'text-white', 'shadow-sm');
        t.classList.add('bg-white', 'text-stone-700', 'hover:bg-stone-100');
      });

      tab.classList.add('bg-[#121417]', 'text-white', 'shadow-sm');
      tab.classList.remove('bg-white', 'text-stone-700', 'hover:bg-stone-100');

      const matKey = tab.getAttribute('data-material');
      renderMaterial(matKey);
    });
  });

  // Cargar tab por defecto
  renderMaterial('marmol');
}

/* ==========================================================================
   6. GALERÍA FILTRABLE Y MODAL DE PROYECTO
   ========================================================================== */
const PROJECTS_DATA = [
  {
    id: 1,
    category: 'cocinas',
    title: 'Isla Monolítica en Cuarcita Patagonia',
    location: 'Barrio Privado Santa Bárbara, Tigre',
    material: 'Cuarcita Patagonia Exótica',
    details: '14.5 m² trabajados • Terminación ingleteada a 45° con cascada doble a piso e iluminación perimetral.',
    time: '12 días hábiles',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    description: 'Diseño integral para residencia moderna. La cuarcita Patagonia fue seleccionada directamente en tabla entera en nuestro showroom, alineando la veta continua desde la mesada horizontal hasta las caídas en cascada laterales. Se realizó trasforo para bacha de acero inoxidable embutida a nivel con desagüe oculto.'
  },
  {
    id: 2,
    category: 'banos',
    title: 'Master Suite & Vanitory en Mármol Carrara',
    location: 'Palermo Chico, CABA',
    material: 'Mármol Blanco Carrara Original Italia',
    details: '8.2 m² de mesada y revestimiento • Doble bacha termo-integrada sin juntas visibles.',
    time: '7 días hábiles',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80',
    description: 'Vanitory suspendido de gran envergadura con frentes regruesados a 12 cm. Las dos bachas fueron esculpidas y ensambladas en el mismo bloque marmóreo, logrando una estética monolítica continua con pendiente suave hacia el desagote lineal.'
  },
  {
    id: 3,
    category: 'cocinas',
    title: 'Cocina Minimalista en Dekton Laurent',
    location: 'Belgrano R, CABA',
    material: 'Superficie Sinterizada Dekton Laurent (Veta Dorada)',
    details: '11 m² de mesada y alzada continua de 90 cm de altura sin cortes visibles.',
    time: '10 días hábiles',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    description: 'Proyecto de arquitectura contemporánea que combina muebles en roble negro con la textura mate y vetas color oro del sinterizado Laurent. Se mecanizaron ranuras de escurridor directamente sobre la placa con declive del 2%.'
  },
  {
    id: 4,
    category: 'especiales',
    title: 'Escalera Flotante en Mármol Travertino Navona',
    location: 'Nordelta, Tigre',
    material: 'Mármol Travertino Apomazado y Resinado',
    details: '22 peldaños compensados autoportantes con alma metálica oculta.',
    time: '15 días hábiles',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
    description: 'Estructura escultórica para hall de doble altura. Cada peldaño fue encamisado en 4 piezas ingleteadas de Travertino con textura satinada al tacto y tratamiento de microporos con resina transparente de alta resistencia.'
  },
  {
    id: 5,
    category: 'exteriores',
    title: 'Mesada de Quincho & Barra en Granito Negro Absoluto Leather',
    location: 'Pilar Golf Club, Buenos Aires',
    material: 'Granito Negro Absoluto Brasil Acabado Cuero (Leather)',
    details: '16 m² lineales • Incluye sector de parrilla y bacha gastronómica.',
    time: '8 días hábiles',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
    description: 'Espacio exterior para eventos sociales. El acabado Leather brinda una textura táctil semejante a la piel, eliminando reflejos molestos del sol directo y ofreciendo resistencia total a las brasas, grasa y humedad de la intemperie.'
  },
  {
    id: 6,
    category: 'especiales',
    title: 'Hogar a Leña & Panel FOCAL en Ónix Esmeralda',
    location: 'Recoleta, CABA',
    material: 'Ónix Verde Esmeralda con Backlight LED 3000K',
    details: '6.8 m² de placa traslúcida con sistema registrable de iluminación.',
    time: '14 días hábiles',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    description: 'Pieza central de diseño para sala principal. El ónix seleccionado cuenta con vetas de cuarzo blanco y tonos pistacho que al encender el circuito LED proyectan una atmósfera cálida, orgánica e inmersiva.'
  }
];

function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryGrid = document.getElementById('gallery-grid');
  const modalOverlay = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalContent = document.getElementById('modal-dynamic-content');

  function renderCards(filter = 'todos') {
    if (!galleryGrid) return;

    const filtered = filter === 'todos' 
      ? PROJECTS_DATA 
      : PROJECTS_DATA.filter(p => p.category === filter);

    galleryGrid.innerHTML = filtered.map(item => `
      <div class="project-card group relative bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer" onclick="openProjectModal(${item.id})">
        <div class="relative h-72 overflow-hidden bg-stone-900">
          <img src="${item.image}" alt="${item.title}" class="project-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          <span class="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-stone-800 px-3 py-1.5 rounded-full shadow-sm">
            ${item.material.split(' ')[0]} ${item.material.split(' ')[1] || ''}
          </span>
          <div class="absolute bottom-4 left-4 right-4 text-white">
            <p class="text-xs text-amber-300 font-medium tracking-wide uppercase mb-1">${item.location}</p>
            <h3 class="font-serif-title text-xl font-bold leading-tight group-hover:text-amber-200 transition-colors">${item.title}</h3>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between bg-white">
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-xs text-stone-600 gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <span class="font-medium text-stone-900">Piedra:</span> ${item.material}
            </div>
            <p class="text-xs text-stone-500 leading-relaxed">${item.details}</p>
          </div>
          <div class="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-800 group-hover:text-amber-700">
            <span>Ver especificaciones completas</span>
            <span class="text-base transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    `).join('');

    // Re-crear iconos de Lucide si fuese necesario
    if (window.lucide) window.lucide.createIcons();
  }

  // Filtrado de pestañas
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#121417]', 'text-white');
        b.classList.add('bg-stone-100', 'text-stone-700', 'hover:bg-stone-200');
      });
      btn.classList.add('bg-[#121417]', 'text-white');
      btn.classList.remove('bg-stone-100', 'text-stone-700', 'hover:bg-stone-200');

      const filter = btn.getAttribute('data-filter');
      renderCards(filter);
    });
  });

  // Modal Open / Close
  window.openProjectModal = function(id) {
    const item = PROJECTS_DATA.find(p => p.id === id);
    if (!item || !modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div class="relative h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-inner bg-stone-900">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
          <div class="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
            Fotografía Real de Obra
          </div>
        </div>
        <div class="space-y-5">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-md">
              ${item.location}
            </span>
            <h2 class="font-serif-title text-2xl md:text-3xl font-bold text-stone-900 mt-2">${item.title}</h2>
          </div>
          
          <p class="text-stone-600 text-sm leading-relaxed">${item.description}</p>
          
          <div class="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2.5 text-xs">
            <div class="flex justify-between py-1 border-b border-stone-200">
              <span class="text-stone-500 font-medium">Material Utilizado:</span>
              <span class="font-bold text-stone-900">${item.material}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-stone-200">
              <span class="text-stone-500 font-medium">Dimensiones & Metraje:</span>
              <span class="font-bold text-stone-900">${item.details.split('•')[0]}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-stone-200">
              <span class="text-stone-500 font-medium">Tiempo de Fabricación y Colocación:</span>
              <span class="font-bold text-emerald-800">${item.time}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-stone-500 font-medium">Garantía Aplicada:</span>
              <span class="font-bold text-stone-900">Garantía Estructural Escrita de por Vida</span>
            </div>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row gap-3">
            <a href="#cotizador" onclick="closeProjectModal();" class="flex-1 text-center bg-[#121417] hover:bg-stone-800 text-white text-xs font-semibold py-3 px-5 rounded-xl transition-all">
              Calcular Inversión Similar
            </a>
            <a href="https://wa.me/5491155554321?text=${encodeURIComponent(`Hola AURA Marmolería, me encantó el proyecto '${item.title}' (${item.material}). Me gustaría consultar si es factible hacer algo similar para mi domicilio.`)}" target="_blank" class="flex-1 text-center btn-gold text-xs font-semibold py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2">
              <span>Consultar por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.classList.add('overflow-hidden');
  };

  window.closeProjectModal = function() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', window.closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) window.closeProjectModal();
    });
  }

  // Render inicial
  renderCards('todos');
}

/* ==========================================================================
   7. ACORDEÓN DE PREGUNTAS FRECUENTES CON BÚSQUEDA
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faq-search-input');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Cerrar otros si se desea acordeón exclusivo
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });

        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  // Filtro en vivo de preguntas
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-trigger')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-content')?.textContent.toLowerCase() || '';
        
        if (questionText.includes(term) || answerText.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   8. FORMULARIO DE COTIZACIÓN FINAL & NOTIFICACIÓN
   ========================================================================== */
function initQuoteForm() {
  const form = document.getElementById('quote-final-form');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value || '';
      const phone = document.getElementById('form-phone')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const location = document.getElementById('form-location')?.value || '';
      const spaceType = document.getElementById('form-space')?.value || '';
      const materialType = document.getElementById('form-material')?.value || '';
      const comments = document.getElementById('form-comments')?.value || '';

      if (!name || !phone) {
        showToast('Por favor completá tu nombre y teléfono para poder enviarte el presupuesto.');
        return;
      }

      // Crear mensaje de WhatsApp
      const waMsg = encodeURIComponent(
        `🏛️ *NUEVA SOLICITUD DE COTIZACIÓN - AURA MARMOLERÍA*\n\n` +
        `👤 *Cliente:* ${name}\n` +
        `📱 *Teléfono:* ${phone}\n` +
        `📧 *Email:* ${email || 'No especificado'}\n` +
        `📍 *Ubicación / Zona:* ${location || 'No especificada'}\n` +
        `🏠 *Ambiente:* ${spaceType}\n` +
        `💎 *Material de interés:* ${materialType}\n` +
        `📝 *Detalles del proyecto:* ${comments || 'Sin comentarios adicionales'}\n\n` +
        `_Enviado desde el formulario web oficial._`
      );

      showToast('¡Gracias! Redirigiendo a WhatsApp con los datos de tu proyecto...');

      setTimeout(() => {
        window.open(`https://wa.me/5491155554321?text=${waMsg}`, '_blank');
        form.reset();
      }, 1000);
    });
  }
}

/* ==========================================================================
   9. BOTÓN FLOTANTE DE WHATSAPP CON CARD DINÁMICA
   ========================================================================== */
function initWhatsAppFloating() {
  const waPopup = document.getElementById('wa-floating-card');
  const waToggleBtn = document.getElementById('wa-floating-btn');
  const waClosePopup = document.getElementById('wa-card-close');

  if (waToggleBtn && waPopup) {
    waToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      waPopup.classList.toggle('hidden');
    });

    if (waClosePopup) {
      waClosePopup.addEventListener('click', (e) => {
        e.stopPropagation();
        waPopup.classList.add('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (!waPopup.contains(e.target) && !waToggleBtn.contains(e.target)) {
        waPopup.classList.add('hidden');
      }
    });
  }
}
