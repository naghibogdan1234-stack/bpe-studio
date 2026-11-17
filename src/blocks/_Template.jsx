import { useFx, LITE } from '../effects/scope.js'
import { SplitHeading } from '../components/Text.jsx'
import './_Template.css'

/* MODEL DE BLOC: copiază fișierul, redenumește-l și schimbă-l.
   - primește "view" (pagina pe care stă) și props din site.config.jsx
   - clasa "rv" = elementul apare frumos când intră în ecran
   - useFx = locul pentru animații JS; tot ce pornești cu s.on / s.loop / s.every se oprește singur
   - pe calculatoare slabe (LITE) sari peste animațiile grele */
export default function Template({ view, title = 'Titlu', text = 'Text' }) {
  const ref = useFx((el, s) => {
    if (LITE) return
    // exemplu: s.on(el, 'pointermove', (e) => { ... })
  })
  return (
    <section className="tpl" data-view={view} ref={ref}>
      <SplitHeading text={title} />
      <p className="rv">{text}</p>
    </section>
  )
}
