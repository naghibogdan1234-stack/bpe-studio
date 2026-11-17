import { useFx } from '../effects/scope.js'
import { initParticles } from '../effects/particles.js'

/* 22.000 de particule: glob -> telefon -> text, cu câte o frază pentru fiecare formă. */
export default function ParticleStory({ view, captions, word = '0 €', label }) {
  const ref = useFx((el, s) => initParticles(el, s, word))
  return (
    <section className="pm" data-view={view} id="pm" aria-label={label} ref={ref}>
      <div className="pm-in"><canvas id="pmc" aria-hidden="true"></canvas>
        <div className="pm-cap">{captions.map((c, i) => <p key={i}>{c}</p>)}</div>
      </div>
    </section>
  )
}
