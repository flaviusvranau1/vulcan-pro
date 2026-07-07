# Changelog — VULCAN PRO

Toate schimbările notabile ale șablonului se notează aici, cu cea mai recentă sus.
**Regulă: orice modificare (de oricine — om sau Claude) primește o intrare nouă
înainte de commit.** Format: versiune — dată — listă scurtă de schimbări.

## 1.3.1 — 2026-07-07

- **Fix:** numele lungi de firmă din hero nu se mai rup în mijlocul cuvântului
  (literele animate sunt grupate acum pe cuvinte întregi, cu spații care permit
  trecerea pe rând doar între cuvinte) — ex. „Vulcanizare AUTO Mari Cris SRL"

## 1.3.0 — 2026-07-07

- **Meniu hamburger** în header (toate ecranele): overlay full-screen cu blur,
  linkuri mari spre toate secțiunile cu reveal în cascadă, telefon + program în
  subsolul meniului (din config.js), închidere pe ESC / click pe link
- **Bară de progres** la scroll (2px, gradient petrol, sus)
- **Granulație de film** subtilă peste tot site-ul (textură cinematică)
- **Vignetă** radială peste secțiunile cu clipuri (adâncime)
- **Marquee** cu text conturat între Sezon și Servicii
- Micro-interacțiuni: hover pe rândurile de servicii (accent + indent),
  săgeata butonului de rezervare glisează la hover
- CHANGELOG.md introdus + regulă de semnalare a schimbărilor în CLAUDE.md
- Nume lungi de firmă în hero (>14 caractere): font redus automat + trecere pe
  rânduri la orice lățime de ecran (necesar pentru `?f=slug` cu nume reale)

## 1.2.1 — 2026-07-07

- **Parametrizare per firmă din URL**: `?f=slug` încarcă automat datele firmei
  (nume, oraș, telefon, WhatsApp, maps) din `firms-vulc.js` (188 de vulcanizări)
  și suprascrie `SITE_CONFIG` + title/description înainte de randare — un singur
  deploy servește toate firmele cu linkuri personalizate

## 1.2.0 — 2026-07-07

- **Încadrare pe telefon (portret)**: clipurile 16:9 cu subiect central (hero,
  assembly) nu se mai decupează — bandă cinematică completă, ușor mărită, muchii
  estompate în negru; macro rămâne cover intenționat (textură)
- Refit + redesenare automată când tab-ul devine vizibil (linkuri deschise în
  fundal, ex. WhatsApp) + fallback la dimensiunea ferestrei când layout-ul lipsește
- Reparat: coliziune de nume `fit` (metodă vs opțiune) care lăsa canvas-ul negru
- Repo făcut public + live pe GitHub Pages

## 1.1.0 — 2026-07-06

- **config.js** — toate datele clientului într-un singur fișier (nume, contact,
  WhatsApp, servicii cu prețuri, pași, footer)
- Secțiuni noi: **Servicii & tarife**, **Protocolul în trei pași**, contact
  complet în secțiunea de rezervare (WhatsApp + tel + adresă + program)
- Stabilitate: failsafe preloader 15s, intro doar pe tab vizibil, cadre lipsă →
  cel mai apropiat cadru valid, `100svh`, refresh la încărcarea fonturilor,
  resize cu debounce, scroll restaurat la început
- Responsive extins: <1024px titlu pe două rânduri, <380px fonturi reduse,
  landscape scund compact; verificat 320–1280px fără overflow
- README.md + CLAUDE.md (ghid de personalizare pentru alt Claude)

## 1.0.0 — 2026-07-04

- Site inițial: hero orbit 360° scrubbed pe canvas (120 cadre WebP), story pinned,
  macro fly-through (100 cadre), protocol cu spec-uri (100 cadre), sezon, CTA
  sticky după 50%, preloader cu progres
- Vizualuri generate cu Seedance 2.0 (Higgsfield) dintr-o singură imagine de
  referință (Nano Banana Pro); Lenis + GSAP ScrollTrigger, vendor local
