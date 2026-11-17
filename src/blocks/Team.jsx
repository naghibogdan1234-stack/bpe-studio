import { useFx, LITE, fine, coarse, onScroll } from '../effects/scope.js'
import { SplitHeading } from '../components/Text.jsx'

/* Echipa: portrete cu halou care respiră, inel de text care se rotește și înclinare 3D. */
function ringText(t) { const n = Math.max(2, Math.floor(72 / (t.length + 3))); return Array(n).fill(t + ' ● ').join('') }

export default function Team({ view, title, text, members }) {
  const ref = useFx((el, s) => {
    if (LITE) return
    const ms = el.querySelectorAll('.mono')
    if (fine()) ms.forEach((m) => {
      s.on(m, 'pointermove', (e) => { const r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; m.style.transform = 'perspective(900px) rotateY(' + (x * 10).toFixed(1) + 'deg) rotateX(' + (-y * 8).toFixed(1) + 'deg)'; m.style.setProperty('--hx', (x * 2).toFixed(2)); m.style.setProperty('--hy', (y * 2).toFixed(2)) })
      s.on(m, 'pointerleave', () => { m.style.transform = ''; m.style.setProperty('--hx', 0); m.style.setProperty('--hy', 0) })
    })
    /* pe telefon nu e mouse: portretele se înclină când trec prin ecran */
    if (coarse()) onScroll(s, () => ms.forEach((m) => { if (!m.offsetParent) return; const r = m.getBoundingClientRect(), k = Math.max(-1, Math.min(1, ((r.top + r.height / 2) / innerHeight - .5) * 2)); m.style.transform = 'perspective(900px) rotateX(' + (k * -8).toFixed(1) + 'deg)'; m.style.setProperty('--hy', (k * 1.6).toFixed(2)) }))
  })
  return (
    <section className="team" data-view={view} id="echipa" aria-labelledby="eh" ref={ref}>
      <div className="team-h"><SplitHeading id="eh" text={title} /><p className="rv">{text}</p></div>
      <div className="tg">
        {members.map((m, i) => (
          <article key={i} className="tm rv" style={i ? { '--i': i } : undefined}>
            <div className={'mono m' + ((i % 3) + 1)}>
              <i className="halo" aria-hidden="true"></i>
              <svg className="ringt" viewBox="0 0 200 200" aria-hidden="true"><text><textPath href="#rp">{ringText(m.ring)}</textPath></text></svg>
              <img src={m.photo} width="720" height="900" loading="lazy" alt={m.name} />
            </div>
            <h3>{m.name}</h3><p className="role">{m.role}</p><p>{m.bio}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
