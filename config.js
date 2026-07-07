/* ============================================================
   CONFIGURARE PER CLIENT — modifică DOAR acest fișier
   ca să personalizezi site-ul pentru o vulcanizare anume.
   Restul site-ului se adaptează automat.
   ============================================================ */
window.SITE_CONFIG = {

  brand: {
    name: 'VULCAN PRO',              // numele vulcanizării (scurt, ideal 1–2 cuvinte)
    tagline: 'Grip Master Program',  // numele ofertei / sloganul
    city: 'București',
  },

  contact: {
    phone: '+40 700 000 000',
    whatsapp: '40700000000',         // doar cifre, cu prefix de țară, fără „+"
    whatsappMessage: 'Salut! Aș vrea o programare pentru anvelope.',
    address: 'Șoseaua Exemplu 42, București',
    mapsUrl: '',                     // link Google Maps (opțional, lasă gol dacă nu ai)
    hours: 'L–V 08–18 · S 09–14',
  },

  // Serviciile afișate în secțiunea „Servicii & tarife".
  // Prețul e text liber — scrie exact ce vrei să apară.
  services: [
    { name: 'Montaj touchless',        detail: 'zero contact cu janta',        price: 'de la 35 lei / roată' },
    { name: 'Echilibrare digitală',    detail: 'precizie ±1 g',                price: 'de la 20 lei / roată' },
    { name: 'Schimb sezonier complet', detail: '4 roți · torque verificat',    price: 'de la 180 lei' },
    { name: 'Hotel anvelope',          detail: 'climatizat & asigurat',        price: 'de la 25 lei / lună' },
    { name: 'Reparație pană',          detail: 'vulcanizare la cald',          price: 'de la 40 lei' },
    { name: 'TPMS',                    detail: 'diagnoză & programare',        price: 'de la 50 lei' },
  ],

  // Pașii din secțiunea „Protocolul, în trei pași".
  process: [
    { title: 'Rezervă',            detail: 'WhatsApp sau telefon. 60 de secunde.' },
    { title: 'Predă cheia',        detail: 'Montaj, echilibrare, torque. 45 de minute.' },
    { title: 'Pleacă în siguranță', detail: 'Raport digital. TPMS verificat.' },
  ],

  // Textul mic din subsolul paginii.
  footerNote: 'SERVICE & PERFORMANCE CENTER · DEMO CONCEPT — SITE FICTIV',
};
