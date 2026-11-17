import { useFx } from '../effects/scope.js'
import { initSand } from '../effects/sand.js'

/* Nisip colorat care cade și se adună pe un text mare. mobileLines = textul pe 2 rânduri pe telefon. */
export default function SandText({ view, text, mobileLines }) {
  const ref = useFx((el, s) => initSand(el.querySelector('canvas'), s, text, mobileLines || [text]))
  return (
    <section className="sand" data-view={view} aria-label={text} ref={ref}>
      <p className="sr">{text}</p><canvas id="sand" aria-hidden="true"></canvas>
    </section>
  )
}
