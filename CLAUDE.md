# VULCAN PRO — instrucțiuni pentru Claude

Acesta este un **șablon de site promo pentru vulcanizări** (tire shops), gândit să fie
personalizat rapid pentru fiecare client și trimis ca demo. Site cinematic „3D scroll":
scroll-ul rotește roata (secvență de cadre pe canvas), cu Lenis + GSAP ScrollTrigger.
Totul e static — fără build step, fără dependențe npm.

## Semnalarea schimbărilor (OBLIGATORIU)

Orice modificare pe care o faci — oricât de mică — se semnalează ca să o vadă
și ceilalți care lucrează pe șablon:

1. **Adaugă o intrare în `CHANGELOG.md`** (versiune nouă + data + ce s-a schimbat,
   pe scurt, în română), înainte de commit.
2. **Commit cu mesaj descriptiv** în română (prima linie = rezumatul schimbării).
3. Dacă schimbi comportamentul (nu doar config), actualizează și secțiunea
   relevantă din acest fișier.

## Cum personalizezi pentru un client nou

1. **Modifică DOAR `config.js`** — nume, tagline, oraș, telefon, WhatsApp (cu mesaj
   precompletat), adresă, link Google Maps, program, cele 6 servicii cu prețuri
   (text liber), cei 3 pași din proces, textul din footer.
2. **`index.html`**: actualizează `<title>`, `<meta name="description">` și
   `og:title` (sunt citite de Google/WhatsApp înainte să ruleze JS).
   La varianta finală scoate „DEMO CONCEPT — SITE FICTIV" din `footerNote` (config.js).
3. **Nume scurte funcționează cel mai bine în hero** (1–2 cuvinte). Numele lungi
   trec automat pe două rânduri sub 1024px — verifică vizual dacă arată bine.
4. **NU modifica** `js/main.js`, `css/style.css` sau structura secțiunilor decât
   dacă ți se cere explicit — scrub-ul, pin-urile și fallback-ul mobil sunt calibrate.

## Rulare locală și verificare

```
node server.js        # -> http://localhost:4173
```

Checklist de verificare după personalizare (toate au fost validate pe șablon):
- preloader-ul ajunge la 100% și dispare; titlul intră cu tracking pe litere
- scroll-ul rotește roata în hero (frame-accurate: 50% scroll = cadrul 60/120)
- secțiunea „Aderența e totul" e pinned pe desktop, cu reveal secvențial pe linii
- caption-urile macro apar sincronizat cu scrub-ul (una câte una)
- cele 4 spec-uri din „Protocol" apar secvențial și rămân vizibile
- CTA-ul sticky „Rezervă-ți intervalul" apare după 50% din scroll
- butonul WhatsApp deschide wa.me cu mesajul precompletat
- mobil (<768px): jumătate de cadre, fără pinning, scrub păstrat; fără overflow orizontal

## Responsive — comportament proiectat

- **≥1024px**: experiența completă (pin-uri, 120 cadre)
- **768–1023px**: la fel, dar titlul hero poate trece pe două rânduri
- **<768px**: 60 de cadre, fără GSAP pinning (reveal simplu la intrare), scrub păstrat,
  layout pe o coloană la servicii/pași/contact
- **<380px**: fonturi reduse, specificațiile din hero ascunse
- **landscape scund (<560px înălțime)**: hero compact, scroll-hint ascuns
- `100svh` pe secțiunile sticky — bara de adresă mobilă nu produce salturi
- **portret (telefon)**: clipurile 16:9 cu subiect central (hero + assembly) NU se
  decupează — se afișează ca bandă cinematică completă, ușor mărită, cu muchiile
  estompate în negru (logica e în `FrameSequence.draw()`, opțiunea `fit: 'auto'`);
  macro-ul rămâne `cover` intenționat (e textură, crop-ul arată bine)

## Stabilitate (nu strica aceste mecanisme)

- Failsafe: dacă preloader-ul nu se închide în 15s, site-ul se deblochează singur
  (script inline în `index.html`)
- Intro-ul pornește doar când tab-ul e vizibil (link deschis în fundal pe WhatsApp)
- Cadre lipsă la încărcare → se desenează cel mai apropiat cadru valid
- Fonturile Google au fallback local (Arial Narrow / Consolas) dacă nu e internet

## Regenerarea vizualurilor (opțional, per client)

Clipurile sursă sunt în `video/` (orbit / macro / assembly). Au fost generate cu
**Seedance 2.0 pe Higgsfield MCP** astfel:
1. O singură imagine de produs (Nano Banana Pro, 2k, 16:9) — roata pe fundal negru
2. Fiecare clip primește imaginea ca `image_references` → produs identic în toate
3. Parametri: `mode: "fast"`, `resolution: "720p"`, 8s, 16:9, `generate_audio: false`
   — **atenție: `mode: "std"` dă 403 „Pro plan required" pe planul actual al contului;
   maxim 2 generări simultane (429 la a treia)**

Extragerea cadrelor (ffmpeg):
```
ffmpeg -i video/orbit.mp4    -vf "fps=120/8.041667" -c:v libwebp -quality 80 frames/hero/%04d.webp
ffmpeg -i video/macro.mp4    -vf "fps=100/8.041667" -c:v libwebp -quality 80 frames/macro/%04d.webp
ffmpeg -i video/assembly.mp4 -vf "fps=100/8.041667" -c:v libwebp -quality 80 frames/assembly/%04d.webp
```
Numărul de cadre trebuie să rămână 120/100/100 (e hardcodat în `js/main.js` la `seqs`).

## Deploy

Site static — merge direct pe GitHub Pages (Settings → Pages → branch `main`, root)
sau Cloudflare Pages. Nu are nevoie de `server.js` în producție (e doar pentru local).
