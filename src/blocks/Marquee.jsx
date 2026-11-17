import { Fragment } from 'react'
import { useFx, LITE, onScroll } from '../effects/scope.js'

/* Banda neagră cu tipuri de afaceri; se înclină când dai scroll repede. */
export default function Marquee({ view, items }) {
  const ref = useFx((el, s) => {
    if (LITE) return
    const run = el.querySelector('.run'); let sk = 0, l = scrollY
    s.every(() => { sk *= .8; run.style.transform = 'skewX(' + (-sk).toFixed(2) + 'deg)' }, 60)
    onScroll(s, () => { const y = scrollY, dv = y - l; l = y; sk += (Math.max(-14, Math.min(14, dv * .35)) - sk) * .3; run.style.transform = 'skewX(' + (-sk).toFixed(2) + 'deg)' })
  })
  const all = [...items, ...items]
  return (
    <div className="mq" data-view={view} aria-hidden="true" ref={ref}>
      <div className="run">{all.map((t, i) => <Fragment key={i}>{t}<i>●</i></Fragment>)}</div>
    </div>
  )
}
