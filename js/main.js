/* ============================================================
   VULCAN PRO — Grip Master Program
   Scroll-scrubbed frame sequences + Lenis + GSAP ScrollTrigger
   Personalizare per client: vezi config.js
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const IS_MOBILE = window.matchMedia('(max-width: 767px)').matches;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = Math.min(window.devicePixelRatio || 1, 2);
const FRAME_STEP = IS_MOBILE ? 2 : 1; // fallback mobil: jumătate din cadre

// Demo-ul pornește mereu de sus — previzibil când îl trimiți cuiva.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ------------------------------------------------------------
   Config per client (config.js) — cu valori de siguranță
   ------------------------------------------------------------ */
const CFG = window.SITE_CONFIG || {};

function applyConfig() {
  const brand = CFG.brand || {};
  const contact = CFG.contact || {};
  const name = brand.name || 'VULCAN PRO';
  const tagline = brand.tagline || 'Grip Master Program';

  document.title = `${name} — ${tagline}`;

  // logo preloader: ultimul cuvânt colorat cu accent
  const words = name.trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  document.querySelector('.pre-logo').innerHTML =
    words.join(' ') + (lastWord ? `<span>${lastWord}</span>` : '');

  document.querySelector('.head-brand').textContent = name;
  document.querySelector('.head-tag').textContent = tagline.toUpperCase();
  const titleEl = document.getElementById('brandTitle');
  titleEl.textContent = name;
  titleEl.setAttribute('aria-label', name);
  // numele lungi de firmă primesc un corp de literă mai mic
  titleEl.classList.toggle('brand-long', name.length > 14);
  document.querySelector('.hero-program').textContent = tagline;

  // servicii & tarife
  const list = document.getElementById('servicesList');
  (CFG.services || []).forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'svc-row';
    row.innerHTML =
      `<span class="svc-idx mono">${String(i + 1).padStart(2, '0')}</span>` +
      `<span><span class="svc-name"></span><span class="svc-detail mono"></span></span>` +
      `<span class="svc-price"></span>`;
    row.querySelector('.svc-name').textContent = s.name || '';
    row.querySelector('.svc-detail').textContent = s.detail || '';
    row.querySelector('.svc-price').textContent = s.price || '';
    list.appendChild(row);
  });

  // pași
  const steps = document.getElementById('processSteps');
  (CFG.process || []).forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'step';
    el.innerHTML =
      `<span class="step-num">${String(i + 1).padStart(2, '0')}</span>` +
      `<h3 class="step-title"></h3><p class="step-detail"></p>`;
    el.querySelector('.step-title').textContent = p.title || '';
    el.querySelector('.step-detail').textContent = p.detail || '';
    steps.appendChild(el);
  });

  // booking: WhatsApp + telefon
  const btn = document.getElementById('bookingBtn');
  const call = document.getElementById('bookingCall');
  if (contact.whatsapp) {
    const msg = encodeURIComponent(contact.whatsappMessage || 'Salut! Aș vrea o programare.');
    btn.href = `https://wa.me/${contact.whatsapp}?text=${msg}`;
    btn.target = '_blank';
    btn.rel = 'noopener';
  } else if (contact.phone) {
    btn.innerHTML = 'SUNĂ ACUM <span class="btn-arrow">&rarr;</span>';
    btn.href = `tel:${contact.phone.replace(/\s/g, '')}`;
  }
  if (contact.phone) {
    call.href = `tel:${contact.phone.replace(/\s/g, '')}`;
    document.getElementById('bookingPhone').textContent = contact.phone;
  } else {
    call.style.display = 'none';
  }

  // contact în meniul overlay
  const menuPhone = document.getElementById('menuPhone');
  const menuHours = document.getElementById('menuHours');
  if (contact.phone) {
    menuPhone.textContent = contact.phone;
    menuPhone.href = `tel:${contact.phone.replace(/\s/g, '')}`;
  } else {
    menuPhone.style.display = 'none';
  }
  if (contact.hours) menuHours.textContent = contact.hours;
  else menuHours.style.display = 'none';

  // grila de contact
  const grid = document.getElementById('contactGrid');
  const items = [];
  if (contact.address) items.push(['ADRESĂ', contact.address, contact.mapsUrl || null]);
  if (contact.hours) items.push(['PROGRAM', contact.hours, null]);
  if (contact.phone) items.push(['TELEFON', contact.phone, `tel:${contact.phone.replace(/\s/g, '')}`]);
  items.forEach(([key, val, href]) => {
    const item = document.createElement('div');
    item.className = 'contact-item';
    const valEl = document.createElement(href ? 'a' : 'span');
    valEl.className = 'contact-val';
    valEl.textContent = val;
    if (href) {
      valEl.href = href;
      if (href.startsWith('http')) { valEl.target = '_blank'; valEl.rel = 'noopener'; }
    }
    const keyEl = document.createElement('span');
    keyEl.className = 'contact-key mono';
    keyEl.textContent = key;
    item.append(keyEl, valEl);
    grid.appendChild(item);
  });

  // footer
  const year = new Date().getFullYear();
  document.getElementById('footLine').textContent =
    `${name.toUpperCase()} © ${year} · ${CFG.footerNote || 'SERVICE & PERFORMANCE CENTER'}`;
}

try { applyConfig(); } catch (e) { console.error('Config error:', e); }

/* ------------------------------------------------------------
   Frame sequence: preload + cover-fit canvas rendering
   ------------------------------------------------------------ */
class FrameSequence {
  // fit: 'cover' = umple ecranul (crop); 'auto' = pe portret devine bandă
  // cinematică completă (subiectul întreg, fundal negru topit în pagină)
  constructor(path, count, canvas, opts = {}) {
    this.path = path;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fitMode = opts.fit || 'auto';
    this.offsetY = opts.offsetY || 0;
    this.images = [];
    this.ready = false;
    this.current = 0;
    this.indices = [];
    for (let i = 1; i <= count; i += FRAME_STEP) this.indices.push(i);
  }

  load(onProgress) {
    let loaded = 0;
    const total = this.indices.length;
    const jobs = this.indices.map((n, slot) => new Promise(resolve => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (onProgress) onProgress(loaded / total);
        resolve();
      };
      img.src = `${this.path}/${String(n).padStart(4, '0')}.webp`;
      this.images[slot] = img;
    }));
    return Promise.all(jobs).then(() => {
      this.ready = true;
      this.fit();
      this.draw(this.current);
    });
  }

  fit() {
    // în tab-uri de fundal layout-ul poate lipsi (clientWidth 0) —
    // canvas-ul e mereu full-viewport, deci fereastra e un fallback corect
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    if (!w || !h) return;
    this.canvas.width = Math.round(w * DPR);
    this.canvas.height = Math.round(h * DPR);
  }

  frameAt(progress) {
    const last = this.images.length - 1;
    return Math.max(0, Math.min(last, Math.round(progress * last)));
  }

  // dacă un cadru lipsește (eroare de rețea), îl desenează pe cel mai apropiat valid
  imageNear(i) {
    const ok = img => img && img.complete && img.naturalWidth > 0;
    if (ok(this.images[i])) return this.images[i];
    for (let d = 1; d < this.images.length; d++) {
      if (ok(this.images[i - d])) return this.images[i - d];
      if (ok(this.images[i + d])) return this.images[i + d];
    }
    return null;
  }

  draw(i) {
    this.current = i;
    if (!this.ready) return;
    const img = this.imageNear(i);
    if (!img) return;
    const cw = this.canvas.width, ch = this.canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const coverScale = Math.max(cw / iw, ch / ih);
    const portrait = cw / ch < 0.8;

    // pe portret, clipurile 16:9 cu subiect central nu se decupează:
    // se afișează ca bandă completă, ușor mărită (max 1.35x fit-width)
    let scale = coverScale;
    if (this.fitMode === 'auto' && portrait) {
      scale = Math.min(coverScale, (cw / iw) * 1.35);
    }

    const dw = iw * scale, dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2 + (portrait ? ch * this.offsetY : 0);

    // fundal negru pur = fundalul clipurilor, banda se topește în pagină
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, cw, ch);
    this.ctx.drawImage(img, dx, dy, dw, dh);

    // estompează muchiile orizontale ale benzii (fără margini vizibile)
    if (dh < ch - 2) {
      const fade = Math.min(dh * 0.18, 90 * DPR);
      let g = this.ctx.createLinearGradient(0, dy, 0, dy + fade);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      this.ctx.fillStyle = g;
      this.ctx.fillRect(0, dy, cw, fade);
      g = this.ctx.createLinearGradient(0, dy + dh - fade, 0, dy + dh);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,1)');
      this.ctx.fillStyle = g;
      this.ctx.fillRect(0, dy + dh - fade, cw, fade);
    }
  }
}

const seqs = {
  // hero + assembly: subiect central -> bandă completă pe portret (offsetY
  // coboară puțin banda, ca titlul să respire); macro: textură -> cover peste tot
  hero:     new FrameSequence('frames/hero',     120, document.getElementById('heroCanvas'), { fit: 'auto', offsetY: 0.06 }),
  macro:    new FrameSequence('frames/macro',    100, document.getElementById('macroCanvas'), { fit: 'cover' }),
  assembly: new FrameSequence('frames/assembly', 100, document.getElementById('assemblyCanvas'), { fit: 'auto' }),
};

function refitAll() {
  Object.values(seqs).forEach(s => { s.fit(); s.draw(s.current); });
  ScrollTrigger.refresh();
}

// redimensionare cu debounce — stabil la rotirea telefonului / resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(refitAll, 150);
});

/* ------------------------------------------------------------
   Lenis smooth scroll, driven by the GSAP ticker
   ------------------------------------------------------------ */
const lenis = new Lenis({ duration: 1.15, smoothWheel: !REDUCED });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.6, force: true });
  });
});

/* ------------------------------------------------------------
   Meniu overlay (hamburger)
   ------------------------------------------------------------ */
const menuEl = document.getElementById('menu');
const navToggle = document.getElementById('navToggle');
let menuOpen = false;

const menuTl = gsap.timeline({ paused: true })
  .to(menuEl, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' })
  .from('.menu-link', {
    autoAlpha: 0, y: 44, duration: 0.55,
    stagger: 0.055, ease: 'power3.out',
  }, '<0.08')
  .from('.menu-foot', { autoAlpha: 0, y: 16, duration: 0.4 }, '<0.35');

function setMenu(open) {
  menuOpen = open;
  document.body.classList.toggle('menu-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  menuEl.setAttribute('aria-hidden', String(!open));
  if (open) {
    lenis.stop();
    menuTl.timeScale(1).play();
  } else {
    lenis.start();
    menuTl.timeScale(1.7).reverse();
  }
}

navToggle.addEventListener('click', () => setMenu(!menuOpen));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) setMenu(false);
});
menuEl.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => setMenu(false))
);

/* ------------------------------------------------------------
   Brand title -> individual letters (for the tracking-in intro)
   ------------------------------------------------------------ */
const brandTitle = document.getElementById('brandTitle');
brandTitle.innerHTML = brandTitle.textContent.trim().split(' ').filter(Boolean).map(w =>
  '<span class="wrd">' + w.split('').map(ch => `<span class="ltr">${ch}</span>`).join('') + '</span>'
).join('<span class="ltr-space"></span>');

/* ------------------------------------------------------------
   Preloader: gate on the hero sequence, lazy-load the rest
   ------------------------------------------------------------ */
const preBarFill = document.getElementById('preBarFill');
const prePct = document.getElementById('prePct');

function introReveal() {
  const tl = gsap.timeline();
  tl.to('#preloader', { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' })
    .add(() => document.body.classList.remove('is-loading'))
    .fromTo('#brandTitle',
      { letterSpacing: '0.45em' },
      { letterSpacing: '0.04em', duration: 1.8, ease: 'power3.out' }, '<')
    .from('#brandTitle .ltr', {
      autoAlpha: 0, yPercent: 30, duration: 0.9,
      stagger: { each: 0.055, from: 'center' }, ease: 'power3.out'
    }, '<0.1')
    .from('.hero-eyebrow', { autoAlpha: 0, y: -14, duration: 0.7 }, '<0.5')
    .from('.hero-sub > *', { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.12 }, '<0.15')
    .from('.scroll-hint', { autoAlpha: 0, duration: 0.8 }, '<0.3');
  if (REDUCED) tl.progress(1);
}

// dacă site-ul e deschis într-un tab de fundal, intro-ul pornește abia
// când tab-ul devine vizibil (altfel ar rula „în gol", nevăzut)
function whenVisible(fn) {
  if (!document.hidden) return fn();
  const h = () => {
    if (!document.hidden) { document.removeEventListener('visibilitychange', h); fn(); }
  };
  document.addEventListener('visibilitychange', h);
}

seqs.hero.load(p => {
  const pct = Math.round(p * 100);
  preBarFill.style.width = pct + '%';
  prePct.textContent = pct + '%';
}).then(() => {
  buildScrollScenes();
  // dacă pagina s-a încărcat într-un tab de fundal, dimensiunile pot fi
  // greșite — refă încadrarea când tab-ul devine vizibil, apoi intro-ul
  whenVisible(() => { refitAll(); introReveal(); });
  // background-load the remaining sequences
  seqs.macro.load().then(() => seqs.macro.draw(seqs.macro.current));
  seqs.assembly.load().then(() => seqs.assembly.draw(seqs.assembly.current));
});

// fonturile schimbă înălțimile după încărcare — recalculează pozițiile pin-urilor
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/* ------------------------------------------------------------
   Scroll scenes
   ------------------------------------------------------------ */
function scrubFrames(sectionSel, seq) {
  ScrollTrigger.create({
    trigger: sectionSel,
    start: 'top top',
    end: 'bottom bottom',
    scrub: REDUCED ? false : 0.35,
    onUpdate: self => {
      const f = seq.frameAt(self.progress);
      if (f !== seq.current || !seq.ready) seq.draw(f);
    },
  });
}

function buildScrollScenes() {
  // fit() golește canvas-ul la redimensionare — redesenează imediat cadrul curent
  Object.values(seqs).forEach(s => { s.fit(); s.draw(s.current); });

  /* --- 01 HERO: scrub the 360° orbit ------------------------ */
  scrubFrames('#hero', seqs.hero);

  // title tracks out, caption breathes in mid-orbit
  gsap.timeline({
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: 0.4 },
  })
    .to('.hero-ui', { autoAlpha: 0, yPercent: -12, ease: 'none', duration: 0.22 }, 0.05)
    .to('.scroll-hint', { autoAlpha: 0, duration: 0.06 }, 0)
    .fromTo('.hero-caption', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.38)
    .to('.hero-caption', { autoAlpha: 0, y: -40, duration: 0.16 }, 0.72)
    .fromTo('#heroCanvas', { scale: 1 }, { scale: 1.06, ease: 'none', duration: 1 }, 0);

  /* --- 02 STORY: pinned text reveals (desktop only) ---------- */
  ScrollTrigger.matchMedia({
    '(min-width: 768px)': () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: '#story',
          start: 'top top',
          end: '+=180%',
          pin: '.story-inner',
          scrub: 0.5,
        },
      })
        .from('.story-title', { autoAlpha: 0, yPercent: 24, duration: 0.5 }, 0)
        .from('.story-line:not(.story-line--big)', {
          autoAlpha: 0, x: -40, duration: 0.45, stagger: 0.35,
        }, 0.35)
        .from('.story-line--big', { autoAlpha: 0, scale: 0.92, duration: 0.7 }, 1.7)
        .to({}, { duration: 0.5 }); // hold at the end of the pin
    },
    '(max-width: 767px)': () => {
      // mobile fallback: no pinning, simple entrance reveals
      gsap.utils.toArray('#story .story-title, #story .story-line').forEach(el => {
        gsap.from(el, {
          autoAlpha: 0, y: 34, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        });
      });
    },
  });

  /* --- 03 MACRO: scrub + captions in sync -------------------- */
  scrubFrames('#macro', seqs.macro);

  gsap.timeline({
    scrollTrigger: { trigger: '#macro', start: 'top top', end: 'bottom bottom', scrub: 0.4 },
  })
    .from('#macro .section-tag', { autoAlpha: 0, duration: 0.05 }, 0)
    .fromTo('.macro-cap[data-step="0"]', { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.06)
    .to('.macro-cap[data-step="0"]',   { autoAlpha: 0, y: -34, duration: 0.08 }, 0.28)
    .fromTo('.macro-cap[data-step="1"]', { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.4)
    .to('.macro-cap[data-step="1"]',   { autoAlpha: 0, y: -34, duration: 0.08 }, 0.6)
    .fromTo('.macro-cap[data-step="2"]', { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.72)
    .to('.macro-cap[data-step="2"]',   { autoAlpha: 0, y: -34, duration: 0.08 }, 0.92);

  /* --- 04 PRECISION: scrub + spec callouts pinned ------------- */
  scrubFrames('#precision', seqs.assembly);

  const specTl = gsap.timeline({
    scrollTrigger: { trigger: '#precision', start: 'top top', end: 'bottom bottom', scrub: 0.4 },
  });
  gsap.utils.toArray('.spec').forEach((el, i) => {
    specTl.to(el, { autoAlpha: 1, x: 0, duration: 0.1, ease: 'power2.out' }, 0.12 + i * 0.2);
  });
  specTl.to({}, { duration: 0.1 }); // hold: specs stay visible to the end

  /* --- 05 SEASONS -------------------------------------------- */
  gsap.from('.season-word', {
    yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out',
    scrollTrigger: { trigger: '#seasons', start: 'top 62%' },
  });
  gsap.from('.seasons-facts .season-fact, .seasons-meta, .seasons-eyebrow', {
    autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.14, ease: 'power2.out',
    scrollTrigger: { trigger: '.seasons-facts', start: 'top 78%' },
  });

  /* --- 06 SERVICES -------------------------------------------- */
  if (document.querySelector('.svc-row')) {
    gsap.from('.svc-row', {
      autoAlpha: 0, y: 36, duration: 0.8, stagger: 0.09, ease: 'power2.out',
      scrollTrigger: { trigger: '#servicesList', start: 'top 78%' },
    });
  }
  gsap.from('.services-title, .services-eyebrow', {
    autoAlpha: 0, y: 30, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '#services', start: 'top 70%' },
  });

  /* --- 07 PROCESS ---------------------------------------------- */
  if (document.querySelector('.step')) {
    gsap.from('.step', {
      autoAlpha: 0, y: 44, duration: 0.9, stagger: 0.16, ease: 'power3.out',
      scrollTrigger: { trigger: '#processSteps', start: 'top 78%' },
    });
  }
  gsap.from('.process-title, .process-eyebrow', {
    autoAlpha: 0, y: 30, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '#process', start: 'top 70%' },
  });

  /* --- 08 BOOKING --------------------------------------------- */
  gsap.from('.booking-inner > *', {
    autoAlpha: 0, y: 40, duration: 1, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '#booking', start: 'top 66%' },
  });

  /* --- Sticky CTA (50%) + bara de progres ---------------------- */
  const cta = document.getElementById('ctaSticky');
  const progressBar = document.getElementById('scrollProgress');
  ScrollTrigger.create({
    start: 0,
    end: () => ScrollTrigger.maxScroll(window),
    onUpdate: self => {
      cta.classList.toggle('is-visible', self.progress >= 0.5);
      progressBar.style.transform = `scaleX(${self.progress})`;
    },
  });

  ScrollTrigger.refresh();
}
