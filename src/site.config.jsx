/* ================================================================
   AICI SE CONSTRUIEȘTE SITE-UL.
   - "site" = datele generale (telefon, oraș...)
   - "pages" = paginile din meniu; fiecare are o listă de blocuri.
     Muți, ștergi sau adaugi blocuri schimbând doar lista.
     Tipurile de blocuri disponibile sunt în src/blocks/index.js.
   ================================================================ */
import { projects } from './content/projects.jsx'
import { team } from './content/team.jsx'
import { site } from './content/site.js'
export { site }


const call = { href: 'tel:' + site.tel, label: 'Sună-l pe Eduard' }

export const pages = [
  {
    id: 'home', hash: '', label: 'Acasă',
    blocks: [
      { type: 'Hero', props: {
        lines: ['Vezi întâi.', 'Plătești apoi.'],
        lead: 'Construim site-ul afacerii tale înainte să plătești un leu. Îl deschizi pe telefon, îl arăți cui vrei, apoi decizi.',
        buttons: [{ label: 'Cere previzualizarea', href: '#pret' }, { label: 'Vezi lucrările', href: '#lucrari', outline: true }],
        side: ['Studio web din Târgu Mureș', 'Hoteluri și afaceri locale', 'Previzualizare gratuită'],
      } },
      { type: 'Marquee', props: { items: ['Hoteluri', 'Pensiuni', 'Restaurante', 'Saloane', 'Cabinete', 'Magazine'] } },
      { type: 'ParticleStory', props: {
        label: 'Cum devine o afacere un site', word: '0 €',
        captions: ['Pornim de la afacerea ta.', 'O transformăm într-un site.', 'Îl vezi înainte să plătești.'],
      } },
      { type: 'Statement', props: {
        text: 'Suntem un studio de trei oameni din Târgu Mureș. Construim site-ul afacerii tale înainte să ne plătești: îl deschizi pe telefon, îl arăți cui vrei și abia apoi decizi. Nu avem încă o listă lungă de clienți și nu ne prefacem că avem. Avem un site livrat, două concepte complete și un mod de lucru în care riscul e al nostru.',
        button: { label: 'Vezi lucrările', href: '#lucrari' },
        badgeText: 'PREVIZUALIZARE GRATUITĂ ● PLĂTEȘTI DOAR DACĂ ÎȚI PLACE ● ', badgeValue: '0 €',
      } },
    ],
  },
  {
    id: 'work', hash: 'lucrari', label: 'Lucrări',
    blocks: [
      { type: 'Gallery', props: {
        title: 'Lucrări', count: projects.length, projects,
        intro: 'Un site livrat unui client și două concepte de redesign pentru hoteluri. Conceptele sunt făcute din proprie inițiativă și nu sunt site-urile oficiale.',
      } },
      { type: 'CallToAction', props: {
        title: 'Îți arătăm și ție cum ar arăta.',
        text: 'Hotel, pensiune, salon, cabinet, restaurant. Ne spui numele afacerii, noi facem previzualizarea, tu o vezi.',
        button: { label: 'Vreau previzualizarea', href: '#pret' },
      } },
    ],
  },
  {
    id: 'process', hash: 'cum', label: 'Proces',
    blocks: [
      { type: 'ProcessSteps', props: { steps: [
        { word: 'Căutăm', img: '/img/flip-1.webp', text: 'Găsim afaceri bune cu un site vechi sau fără site deloc.' },
        { word: 'Facem', img: '/img/flip-2.webp', text: 'Construim site-ul complet, cu pozele și informațiile voastre reale.' },
        { word: 'Arătăm', img: '/img/flip-3.webp', tall: true, text: 'Vi-l trimitem ca link. Îl deschideți pe telefon, gratuit, fără obligații.' },
        { word: 'Alegi', img: '/img/flip-4.webp', text: 'Îl cumperi, ceri modificări sau spui nu. Toate trei sunt în regulă.' },
      ] } },
      { type: 'TetrisWall', props: {
        title: 'Piesă cu piesă.',
        text: 'Niciun șablon. Fiecare site e construit de la zero, pentru o singură afacere: pozele ei, textele ei, clienții ei.',
      } },
    ],
  },
  {
    id: 'price', hash: 'pret', label: 'Preț',
    blocks: [
      { type: 'PriceTicket', props: {
        question: 'Cum se numește afacerea ta?', placeholder: 'ex. Pensiunea Brazilor',
        examples: ['Pensiunea Brazilor', 'Salon Ana', 'Hotel Central', 'Cabinet Dr. Pop', 'Bistro Fabrica'],
        title: 'Previzualizare pentru',
        terms: ['Gata în câteva zile', 'Pe telefon și desktop', 'Site complet: de la 999 €', 'Plata doar dacă îți place'],
        value: '0 €', valueNote: 'previzualizarea', button: call,
        note: 'Fiecare site e diferit, așa că și prețul diferă: depinde de câte pagini are și de ce trebuie să facă. Îl stabilim împreună, deschis, înainte să începem. Previzualizarea rămâne gratuită.',
      } },
    ],
  },
  {
    id: 'team', hash: 'echipa', label: 'Echipa',
    blocks: [
      { type: 'Team', props: { title: 'Trei oameni.', text: 'Fiecare cu partea lui. Vorbești cu unul singur, lucrează toți trei.', members: team } },
    ],
  },
  {
    id: 'contact', hash: 'contact', label: 'Contact', nav: false,
    blocks: [
      { type: 'SandText', props: { text: 'Hai să vorbim.', mobileLines: ['Hai să', 'vorbim.'] } },
      { type: 'Contact', props: {
        phone: site.phone, tel: site.tel, who: 'Răspunde Eduard.',
        items: [
          { title: 'Eduard Niculescu', text: 'Relația cu clienții. Cu el vorbești de la primul telefon până la lansare.' },
          { title: 'Târgu Mureș', text: 'Lucrăm cu afaceri din toată țara.' },
          { title: 'Răspundem în aceeași zi', text: <>Ora la noi: <span data-clock>--:--</span></> },
        ],
      } },
    ],
  },
]
