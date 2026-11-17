# BPE Studio — site-ul de prezentare (React + Vite)

## Pornire
```bash
npm install
npm run dev      # deschide http://localhost:5173 și vezi modificările pe loc
npm run build    # face folderul dist/ pentru Netlify
```

## Unde schimbi ce
| Vreau să schimb… | Fișier |
| --- | --- |
| Ordinea paginilor, blocurile de pe fiecare pagină, textele | `src/site.config.jsx` |
| Telefonul, orașul, textul din subsol | `src/content/site.js` |
| Proiectele din galerie (poze, clip, text) | `src/content/projects.jsx` |
| Echipa | `src/content/team.jsx` |
| Pozele și clipurile | `public/img/` (în cod: `/img/nume.webp`) |
| Culori, fonturi, stilul secțiunilor | `src/styles/site.css` |

## Cum funcționează blocurile
Fiecare pagină din `site.config.jsx` e o listă de blocuri:
```js
{ id: 'work', hash: 'lucrari', label: 'Lucrări', blocks: [
  { type: 'Gallery', props: { ... } },
  { type: 'CallToAction', props: { title: '...', text: '...', button: { label: '...', href: '#pret' } } },
] }
```
- **Muți un bloc:** îl muți în listă (și pe altă pagină).
- **Ștergi un bloc:** ștergi rândul.
- **Pagină nouă:** adaugi un obiect în `pages`; apare singură în meniu (`nav: false` = nu apare în meniu).

Blocuri disponibile (`src/blocks/`): `Hero`, `Marquee`, `ParticleStory`, `Statement`, `Gallery`,
`CallToAction`, `ProcessSteps`, `TetrisWall`, `PriceTicket`, `Team`, `SandText`, `Contact`, `Template`.

## Bloc nou
1. Copiază `src/blocks/_Template.jsx` (și `_Template.css`) cu un nume nou, de ex. `Reviews.jsx`.
2. Înregistrează-l în `src/blocks/index.js`.
3. Pune-l pe o pagină în `site.config.jsx`: `{ type: 'Reviews', props: { ... } }`.

Reguli pentru blocuri:
- Elementul principal primește `data-view={view}` (așa știe meniul pe ce pagină stă).
- Clasa `rv` face elementul să apară frumos când intră în ecran.
- Animațiile JS se scriu în `useFx((el, s) => { ... })`. Folosește `s.on`, `s.loop`, `s.every`, `s.later`, `s.watch`: se opresc singure când blocul dispare.
- Verifică `LITE`: pe calculatoarele slabe sari peste animațiile grele.

## Efecte
`src/effects/`:
- `liquid.js`: bilele lichide 3D (WebGL).
- `particles.js`: globul de particule.
- `tetris.js`
- `sand.js`
- `gallery.js`
- `site.js`: efectele globale: meniul și cortina albastră, preloader, cursor, apariții, ceas.

## Mod simplu (calculatoare slabe)
Scriptul din `index.html` detectează calculatoarele fără placă video și pune clasa `lite`: fără 3D și fără animații care lasă urme.
- Pentru test: `?lite` sau `?full` la finalul adresei.

## Publicare pe Netlify
- **Varianta rapidă:** `npm run build`, apoi tragi folderul `dist/` pe app.netlify.com/drop (sau pe site-ul existent, la Deploys).
- **Varianta cu GitHub:** urci proiectul pe GitHub și îl conectezi în Netlify. Setările se iau din `netlify.toml`.
