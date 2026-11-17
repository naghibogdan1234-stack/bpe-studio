import { site } from '../content/site.js'
import { Letters } from './Text.jsx'
import { useFx, LITE, fine } from '../effects/scope.js'

export default function Footer() {
  /* literele din logo se ridică după mouse */
  const ref = useFx((foot, s) => {
    const wm = foot.querySelector('.wm')
    if (!fine() || LITE) return
    const wl = [...wm.children]
    s.on(wm, 'pointermove', (e) => {
      if (!wm.classList.contains('in')) return
      wl.forEach((x) => { const r = x.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2)), k = Math.max(0, 1 - d / (innerWidth * .16)); x.style.transition = 'translate 320ms cubic-bezier(.23,1,.32,1)'; x.style.translate = '0 ' + (-k * k * .22).toFixed(3) + 'em' })
    })
    s.on(wm, 'pointerleave', () => wl.forEach((x) => { x.style.translate = '' }))
  })
  return (
    <footer className="foot" ref={ref}>
      <p className="wm rv" id="wm" aria-label={site.name}><Letters text={site.name} className="" /></p>
      <div className="fend">
        <a className="btn sm white" href="#" id="top">Sus</a>
        <span>{site.footerNote}</span>
        <a className="mode-sw" href="?full">Versiunea animată</a>
      </div>
    </footer>
  )
}
