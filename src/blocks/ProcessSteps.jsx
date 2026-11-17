import { useFx, LITE, onScroll } from '../effects/scope.js'
import { addLiquidScene, C } from '../effects/liquid.js'

/* Pașii procesului: fiecare pas e un ecran cu un cuvânt mare, o imagine care se rotește 3D
   și o explicație. Fundalul lichid își schimbă culoarea la fiecare pas (maxim 4 culori). */
export default function ProcessSteps({ view, steps }) {
  const ref = useFx((el, s) => {
    const stop = addLiquidScene(el.querySelector('canvas.gl'), { mode: 1, host: el, bg: [C.SKY, C.INK, C.PEARL, C.BLUE], kc: [C.INK, C.BLUE, C.BLUE, C.INK], sph: [
      { x: .05, y: .22, ax: .55, ay: .26, f: .40, g: .52, p: 0, r: .33 },
      { x: -.10, y: .25, ax: .70, ay: .22, f: .31, g: .43, p: 1.9, r: .24 },
      { x: .20, y: .18, ax: .45, ay: .30, f: .57, g: .36, p: 3.1, r: .20 },
      { x: 0, y: .30, ax: .85, ay: .18, f: .26, g: .61, p: 4.4, r: .15 },
      { x: .10, y: .20, ax: .30, ay: .24, f: .66, g: .48, p: 5.2, r: .13 },
      { m: 1, r: .15 }] })
    if (!LITE) {
      const flips = el.querySelectorAll('.flip')
      onScroll(s, () => {
        const vh = innerHeight
        flips.forEach((f) => { const b = f.parentNode.getBoundingClientRect(); let k = 1 - (b.top + b.height) / (vh + b.height); k = Math.max(0, Math.min(1, k)); f.style.setProperty('--ry', (-40 + 80 * k) + 'deg'); f.style.setProperty('--rx', (16 - 32 * k) + 'deg') })
      })
    }
    return stop
  })
  return (
    <section className="how" data-view={view} id="cum" aria-label="Cum lucrăm" ref={ref}>
      <div className="liq" aria-hidden="true"><canvas className="gl"></canvas></div>
      {steps.map((st, i) => (
        <div key={i} className={'panel p' + ((i % 4) + 1)}>
          <div className="vwrap"><p className="verb" aria-hidden="true">{st.word}</p></div>
          <figure className="flip"><img src={st.img} width={st.tall ? 400 : 820} height={st.tall ? 866 : 512} loading="lazy" alt="" className={st.tall ? 'tall' : undefined} /></figure>
          <p className="say rv"><span className="sr">{st.word}. </span>{st.text}</p>
        </div>
      ))}
    </section>
  )
}
