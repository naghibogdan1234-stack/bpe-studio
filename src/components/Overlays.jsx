/* Elemente fixe peste tot site-ul: preloader, cursor, cortina dintre pagini, bara de progres. */
export default function Overlays() {
  return (
    <>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <defs id="defs"><path id="rp" d="M100 100m-90 0a90 90 0 1 1 180 0a90 90 0 1 1-180 0" /></defs>
      </svg>
      <div className="pre" aria-hidden="true"><span>BPE Studio</span><b id="pc">100</b></div>
      <div id="bar" aria-hidden="true"></div>
      <div id="cur" aria-hidden="true"></div>
      <div id="cur2" aria-hidden="true"></div>
      <div className="wipe" id="wipe" aria-hidden="true"><b></b></div>
    </>
  )
}
