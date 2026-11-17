import { useFx } from '../effects/scope.js'
import { addLiquidScene, C } from '../effects/liquid.js'

/* Prima secțiune: titlul mare literă cu literă + bilele lichide 3D care urmăresc mouse-ul. */
const SCENE = { my: .42, bg: [C.WHITE], sph: [
  { x: .60, y: .10, ax: .16, ay: .22, f: .42, g: .55, p: 0, r: .36, c: C.BLUE },
  { x: .76, y: -.12, ax: .20, ay: .20, f: .55, g: .38, p: 1.3, r: .26, c: C.BLUE },
  { x: .48, y: -.20, ax: .22, ay: .26, f: .33, g: .47, p: 2.1, r: .20, c: C.SKY },
  { x: .84, y: .30, ax: .12, ay: .24, f: .48, g: .61, p: 3.4, r: .15, c: C.INK },
  { x: .38, y: .28, ax: .18, ay: .18, f: .37, g: .44, p: 4.2, r: .15, c: C.PEARL },
  { m: 1, r: .15, c: C.BLUE }] }

export default function Hero({ view, lines, lead, buttons = [], side = [] }) {
  const ref = useFx((el) => addLiquidScene(el.querySelector('canvas.gl'), SCENE))
  return (
    <section className="hero" data-view={view} aria-labelledby="h" ref={ref}>
      <canvas className="gl" aria-hidden="true"></canvas>
      <h1 className="h1" id="h" aria-label={lines.join(' ')}>
        {lines.map((ln, li) => (
          <span className="ln chs" key={li}><span>
            {ln.split('').map((c, i) => <span key={i} className="ch" style={{ '--c': i + li * 5 }}>{c === ' ' ? ' ' : c}</span>)}
          </span></span>
        ))}
      </h1>
      <div className="hero-b">
        <div className="hero-l">
          <p className="lead hfade">{lead}</p>
          <div className="hero-btns hfade">
            {buttons.map((b, i) => <a key={i} className={'btn' + (b.outline ? ' line' : '')} href={b.href}>{b.label}</a>)}
          </div>
        </div>
        <p className="hero-r hfade">
          {side.map((t, i) => <span key={i} {...(i === 0 ? { 'data-greet': '' } : {})}>{t}</span>)}
        </p>
      </div>
    </section>
  )
}
