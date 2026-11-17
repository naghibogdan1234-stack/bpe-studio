import { Fragment } from 'react'
import { useFx, LITE, onScroll } from '../effects/scope.js'

/* Textul "despre noi" care se aprinde cuvânt cu cuvânt la scroll + insigna care se rotește. */
export default function Statement({ view, text, button, badgeText, badgeValue }) {
  const ref = useFx((el, s) => {
    const sw = [...el.querySelectorAll('.sw')], st = el.querySelector('#st'), badge = el.querySelector('.bs')
    onScroll(s, () => {
      const vh = innerHeight, r = st.getBoundingClientRect(), p = (vh * .85 - r.top) / (r.height + vh * .35), n = Math.round(Math.max(0, Math.min(1, p)) * sw.length)
      for (let i = 0; i < sw.length; i++) sw[i].classList.toggle('on', i < n)
      if (!LITE && badge) badge.style.rotate = (scrollY * .2).toFixed(1) + 'deg'
    })
  })
  const words = text.split(' ')
  return (
    <section className="st" data-view={view} aria-label="Despre noi" ref={ref}>
      <p id="st" aria-label={text}>{words.map((w, i) => <Fragment key={i}><span className="sw" aria-hidden="true">{w}</span>{i < words.length - 1 ? ' ' : ''}</Fragment>)}</p>
      {button && <a className="btn" href={button.href} style={{ marginTop: 44 }}>{button.label}</a>}
      <div className="badge" aria-hidden="true">
        <span className="bs" id="badge"><svg viewBox="0 0 200 200"><defs><path id="bp" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" /></defs><text><textPath href="#bp">{badgeText}</textPath></text></svg></span>
        <b>{badgeValue}</b>
      </div>
    </section>
  )
}
