# VULCAN PRO — șablon site promo pentru vulcanizări

Site cinematic „3D scroll": scroll-ul rotește roata (secvență de 120 de cadre pe canvas),
cu Lenis smooth scroll + GSAP ScrollTrigger. Gândit ca **demo de trimis vulcanizărilor** —
se personalizează pentru fiecare client în câteva minute.

## Cum îl personalizezi pentru un client

**Tot ce ține de client stă în `config.js`.** Deschide fișierul și modifică:

| Câmp | Ce este |
|---|---|
| `brand.name` | Numele vulcanizării (scurt, 1–2 cuvinte — apare uriaș în hero) |
| `brand.tagline` | Numele ofertei (ex. „Grip Master Program") |
| `contact.phone` | Telefonul afișat + link `tel:` |
| `contact.whatsapp` | Număr WhatsApp, doar cifre cu prefix de țară (ex. `40722123456`) |
| `contact.whatsappMessage` | Mesajul precompletat când clientul apasă butonul |
| `contact.address` / `mapsUrl` | Adresa + link Google Maps (opțional) |
| `contact.hours` | Programul |
| `services` | Lista de servicii cu prețuri (text liber la preț) |
| `process` | Cei 3 pași din secțiunea „Protocolul" |
| `footerNote` | Textul din subsol (scoate „DEMO CONCEPT" la varianta finală) |

Pentru varianta finală, schimbă și `<title>` + `<meta name="description">` din `index.html`
(sunt citite de Google înainte să ruleze JavaScript).

## Rulare locală

```
node server.js
```
apoi deschide http://localhost:4173

## Structură

- `frames/hero|macro|assembly` — secvențele de cadre WebP (scrub la scroll)
- `video/` — clipurile MP4 originale (nu sunt folosite de site, doar sursă)
- `assets/hero.png` — imaginea produsului (og:image)
- `vendor/` — GSAP, ScrollTrigger, Lenis (locale, fără CDN)

## Comportament

- Preloader cu progres — site-ul se deblochează când secvența hero e încărcată
  (failsafe: se deblochează oricum după 15s)
- Sub 768px: jumătate din cadre, fără pinning (reveal simplu), scrub păstrat
- CTA sticky „Rezervă-ți intervalul" apare după 50% din scroll
- Cadre lipsă la încărcare → se desenează cel mai apropiat cadru valid

## Regenerarea vizualurilor (opțional, per client)

Clipurile au fost generate cu Seedance 2.0 (Higgsfield), pornind de la o singură
imagine de referință a produsului, apoi extrase în cadre cu ffmpeg:

```
ffmpeg -i video/orbit.mp4 -vf "fps=120/8.041667" -c:v libwebp -quality 80 frames/hero/%04d.webp
ffmpeg -i video/macro.mp4 -vf "fps=100/8.041667" -c:v libwebp -quality 80 frames/macro/%04d.webp
ffmpeg -i video/assembly.mp4 -vf "fps=100/8.041667" -c:v libwebp -quality 80 frames/assembly/%04d.webp
```
