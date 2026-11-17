import { useFx, LITE, fine, slug } from '../effects/scope.js'
import { addLiquidScene, liquidFilter, C } from '../effects/liquid.js'

/* Biletul de preț: scrii numele afacerii și apare pe bilet (sau se scriu singure exemple). */
export default function PriceTicket({ view, question, placeholder, examples = [], title, terms, value, valueNote, button, note }) {
  const ref = useFx((el, s) => {
    const stop = addLiquidScene(el.querySelector('canvas.gl'), { bg: [C.BLUE], sph: [
      { x: -.95, y: .35, ax: .10, ay: .22, f: .38, g: .49, p: 0, r: .34, c: C.SKY },
      { x: -1.02, y: -.62, ax: .08, ay: .12, f: .52, g: .41, p: 1.4, r: .21, c: C.PEARL },
      { x: .96, y: -.30, ax: .10, ay: .24, f: .35, g: .57, p: 2.6, r: .31, c: C.PEARL },
      { x: .84, y: .62, ax: .13, ay: .14, f: .47, g: .39, p: 3.7, r: .20, c: C.SKY },
      { x: -.70, y: .85, ax: .20, ay: .08, f: .44, g: .63, p: 4.9, r: .14, c: C.WHITE },
      { m: 1, r: .14, c: C.WHITE }] })
    const biz = el.querySelector('#biz'), nm = el.querySelector('#nm'), url = el.querySelector('#url'), tk = el.querySelector('.ticket')
    const LN = liquidFilter(nm, '.02 .04')
    let stopTyping = false
    s.on(biz, 'input', () => { const v = biz.value.trim(); nm.textContent = v || 'afacerea ta'; url.textContent = (slug(v) || 'afacerea-ta') + '.ro'; LN.burst(16) })
    /* biletul se taie (perforația) la înălțimea părții de sus */
    const cut = () => tk.style.setProperty('--cut', tk.querySelector('.main').offsetHeight + 'px')
    cut(); s.on(window, 'resize', cut)
    if (fine() && !LITE) {
      s.on(tk, 'pointermove', (e) => { const r = tk.getBoundingClientRect(); tk.style.setProperty('--ky', (((e.clientX - r.left) / r.width - .5) * 10) + 'deg'); tk.style.setProperty('--kx', (-((e.clientY - r.top) / r.height - .5) * 10) + 'deg') })
      s.on(tk, 'pointerleave', () => { tk.style.setProperty('--kx', '0deg'); tk.style.setProperty('--ky', '0deg') })
    }
    /* exemplele se scriu singure până începi tu să scrii */
    if (!LITE && examples.length) {
      ;['focus', 'input'].forEach((n) => s.on(biz, n, () => { stopTyping = true; if (!biz.value) { nm.textContent = 'afacerea ta'; url.textContent = 'afacerea-ta.ro' } }))
      const setN = (t) => { nm.textContent = t; const c = document.createElement('span'); c.className = 'caret'; nm.appendChild(c); url.textContent = (slug(t) || 'afacerea-ta') + '.ro' }
      let ni = 0, ci = 0, dir = 1
      const type = () => {
        if (stopTyping) return; let d = 140
        if (nm.offsetParent) {
          const w = examples[ni]; ci += dir; setN(w.slice(0, ci))
          if (dir > 0 && ci >= w.length) { dir = -1; d = 1900 } else if (dir < 0 && ci <= 0) { dir = 1; ni = (ni + 1) % examples.length; d = 500 } else d = dir > 0 ? 95 + Math.random() * 70 : 38
        }
        s.later(type, d)
      }
      type()
    }
    return stop
  })
  return (
    <section className="price" data-view={view} id="pret" aria-labelledby="tk" ref={ref}>
      <canvas className="gl" aria-hidden="true"></canvas>
      <div className="ask rv">
        <label htmlFor="biz">{question}</label>
        <input id="biz" type="text" autoComplete="organization" maxLength={40} placeholder={placeholder} />
      </div>
      <div className="ticket rv" style={{ '--i': 1 }}>
        <span className="perf" aria-hidden="true"></span>
        <div className="main">
          <div>
            <h2 id="tk">{title} <span className="nm" id="nm">afacerea ta</span></h2>
            <p className="url" id="url" aria-live="polite">afacerea-ta.ro</p>
          </div>
          <ul className="terms">{terms.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
        <div className="stub">
          <b>{value}</b><span>{valueNote}</span>
          <a className="btn blue" id="send" href={button.href}>{button.label}</a>
        </div>
      </div>
      <p className="after rv" style={{ '--i': 2 }}><span>{note}</span></p>
    </section>
  )
}
