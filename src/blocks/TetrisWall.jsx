import { useFx } from '../effects/scope.js'
import { initTetris } from '../effects/tetris.js'
import { SplitHeading } from '../components/Text.jsx'

/* Titlu + text în stânga, zid de Tetris care se construiește singur în dreapta. */
export default function TetrisWall({ view, title, text, colors }) {
  const ref = useFx((el, s) => initTetris(el.querySelector('canvas'), s, colors))
  return (
    <section className="tet" data-view={view} aria-labelledby="th" ref={ref}>
      <div className="tet-t"><SplitHeading id="th" text={title} /><p className="lead rv" style={{ '--i': 1 }}>{text}</p></div>
      <canvas id="tetris" aria-hidden="true"></canvas>
    </section>
  )
}
