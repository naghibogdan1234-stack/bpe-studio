/* Proiectele din galeria "Lucrări". Ordinea de aici = ordinea taburilor.
   Pozele stau în public/img/. Un proiect fără clip: șterge "video". Fără buton: șterge "link". */
export const projects = [
  {
    name: 'Florăria Amaryllis',
    subtitle: 'Florărie și design floral, Târgu Mureș',
    text: 'Florărie din Târgu Mureș, pentru buchete, nunți și evenimente. Site-ul prezintă colecția de buchete și portofoliul de evenimente, iar butonul de sunat și cererea de ofertă sunt la îndemână pe fiecare pagină.',
    meta: [['Client', 'Florăria Amaryllis'], ['Loc', 'Târgu Mureș'], ['Realizat de', 'Petrut Darius'], ['Stadiu', 'Site livrat, online']],
    link: { href: 'https://floraria-amaryllis.ro/', label: 'Vezi site-ul live' },
    video: { src: '/img/v-fa.mp4', poster: '/img/g-fa0.webp', label: 'Clip: site-ul live', alt: 'Clip din site-ul Florăria Amaryllis' },
    slides: [
      { img: '/img/g-fa1.webp', label: 'Prima pagină' },
      { img: '/img/g-fa2.webp', label: 'Colecția de buchete' },
      { img: '/img/g-fa3.webp', label: 'Nunți' },
      { img: '/img/g-fa4.webp', label: 'Evenimente' },
      { img: '/img/g-fa5.webp', label: 'Povestea florăriei' },
    ],
    phone: '/img/fa-tel1.webp',
  },
  {
    name: 'Casa Popeea',
    subtitle: 'Hotel boutique, Brăila',
    text: 'Unsprezece camere într-o clădire de patrimoniu din cartierul grecesc al Brăilei. Site-ul se deschide ca o ușă: derulezi și intri în casă, prin stejar, piatră și catifea.',
    meta: [['Client', 'Hotel boutique'], ['Loc', 'Brăila'], ['Ce am făcut', 'Design, română și engleză, rezervări'], ['Stadiu', 'Concept de redesign']],
    video: { src: '/img/v-cp.mp4', poster: '/img/g-cp0.webp', label: 'Intro: așa se deschide site-ul', alt: 'Clip din site-ul Casa Popeea' },
    slides: [
      { img: '/img/g-cp1.webp', label: 'Fațada din 1900' },
      { img: '/img/g-cp2.webp', label: 'Ușa din stejar sculptat' },
      { img: '/img/g-cp3.webp', label: 'Casa din 1900' },
      { img: '/img/g-cp4.webp', label: 'Camerele' },
      { img: '/img/g-cp5.webp', label: 'Sala cu ferestre arcuite' },
    ],
    phone: '/img/cp-tel1.webp',
  },
  {
    name: 'New Belvedere',
    subtitle: 'Hotel de 5 stele, Mangalia',
    text: 'Hotelul stă deasupra cetății Callatis, veche de 2.300 de ani. Am făcut din asta povestea site-ului: o zi la hotel, de la răsărit la cină, cu situl arheologic ca secțiune separată și tarifele la vedere.',
    meta: [['Client', 'Hotel de 5 stele'], ['Loc', 'Mangalia'], ['Ce am făcut', 'Design, texte, varianta de telefon'], ['Stadiu', 'Concept de redesign']],
    video: { src: '/img/v-nb.mp4', poster: '/img/g-nb0.webp', label: 'Intro: așa se deschide site-ul', alt: 'Clip din site-ul New Belvedere' },
    slides: [
      { img: '/img/g-nb1.webp', label: 'Piscina la apus' },
      { img: '/img/g-nb2.webp', label: 'Piscina, ziua' },
      { img: '/img/g-nb3.webp', label: 'O zi la New Belvedere' },
      { img: '/img/g-nb4.webp', label: 'Terasa de pe plajă' },
      { img: '/img/g-nb5.webp', label: 'Deasupra cetății Callatis' },
    ],
    phone: '/img/nb-tel1.webp',
  },
]
