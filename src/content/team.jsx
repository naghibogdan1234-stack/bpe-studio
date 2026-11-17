import { site } from '../content/site.js'

/* Echipa. ring = textul care se rotește în jurul pozei. Pozele stau în public/img/. */
export const team = [
  { name: 'Bogdan Naghi', role: 'Front-end', ring: 'FRONT-END', photo: '/img/tm-bogdan.webp',
    bio: 'Designul și tot ce vezi pe ecran: pagini, animații, varianta de telefon.' },
  { name: 'Eduard Niculescu', role: 'Relația cu clienții', ring: 'RELAȚIA CU CLIENȚII', photo: '/img/tm-eduard.webp',
    bio: <>Omul cu care vorbești: ofertă, termene și orice întrebare ai pe parcurs. Îl găsești la <a href={'tel:' + site.tel}>{site.phone}</a>.</> },
  { name: 'Petrut Darius', role: 'Back-end', ring: 'BACK-END', photo: '/img/tm-petrut.webp',
    bio: 'Ce nu se vede, dar trebuie să meargă: formulare, rezervări, găzduire, viteză.' },
]
