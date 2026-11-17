import { useFx, LITE, onScroll } from '../effects/scope.js'
import { initGallery } from '../effects/gallery.js'

/* Galeria de lucrări. Proiectele vin din content/projects.jsx:
   fiecare are clip (opțional), poze, telefon și textul din dreapta. */
export default function Gallery({ view, title, count, intro, projects }) {
  const ref = useFx((el, s) => {
    initGallery(el.querySelector('#gal'), s)
    if (LITE) return
    const phones = el.querySelectorAll('.phone')
    onScroll(s, () => phones.forEach((ph) => { const b = ph.parentNode.getBoundingClientRect(); ph.style.setProperty('--py', ((b.top + b.height / 2 - innerHeight / 2) * -.12).toFixed(1) + 'px') }))
  })
  /* toate slide-urile, în ordine: clipul proiectului, apoi pozele */
  const slides = []
  projects.forEach((p, pi) => {
    if (p.video) slides.push({ pi, label: p.video.label, video: p.video, thumb: p.video.poster, aria: p.name + ': clip' })
    p.slides.forEach((sl) => slides.push({ pi, label: sl.label, img: sl.img, thumb: sl.img, aria: p.name + ': ' + sl.label }))
  })
  return (
    <section className="work" data-view={view} id="lucrari" aria-labelledby="lw" ref={ref}>
      <div className="work-h"><h2 id="lw" className="h2 rv">{title}{count ? <sup>{count}</sup> : null}</h2><p className="rv">{intro}</p></div>
      <div className="gal rv" id="gal">
        <div className="gtabs" role="tablist" aria-label="Proiecte">
          {projects.map((p, i) => <button key={i} className="gtab" data-p={i} type="button" role="tab">{p.name}</button>)}
        </div>
        <div className="gmain">
          <div className="gview">
            <div className="frame" id="gframe">
              <div className="chrome" aria-hidden="true"><i></i><i></i><i></i><span id="glabel">Lucrări</span><b id="gcount"></b></div>
              <div className="gstage" id="gstage">
                {slides.map((sl, i) => (
                  <div key={i} className="gs" data-p={sl.pi} data-l={sl.label}>
                    {sl.video
                      ? <video muted playsInline preload="metadata" poster={sl.video.poster} src={sl.video.src} aria-label={sl.video.alt}></video>
                      : <i role="img" aria-label={sl.aria} style={{ backgroundImage: `url(${sl.img})` }}></i>}
                  </div>
                ))}
                <span className="gprog" id="gprog" aria-hidden="true"></span>
              </div>
            </div>
            {projects.map((p, i) => p.phone && (
              <div key={i} className="phone" data-p={i}><img src={p.phone} width="540" height="1169" loading="lazy" alt={p.name + ' pe telefon'} /></div>
            ))}
            <button className="garr gprev" id="gprev" type="button" aria-label="Imaginea anterioară"><span aria-hidden="true">←</span></button>
            <button className="garr gnext" id="gnext" type="button" aria-label="Imaginea următoare"><span aria-hidden="true">→</span></button>
          </div>
          <div className="ginfo">
            {projects.map((p, i) => (
              <div key={i} className="gi" data-p={i}>
                <h3>{p.name}</h3><p className="gi-m">{p.subtitle}</p><p>{p.text}</p>
                <dl className="meta">{p.meta.map(([k, v], j) => <div key={j}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                {p.link && <a className="btn sm gi-l" href={p.link.href} target="_blank" rel="noopener">{p.link.label}</a>}
              </div>
            ))}
          </div>
        </div>
        <div className="gstrip" id="gstrip">
          {slides.map((sl, i) => (
            <button key={i} className={'gt' + (sl.video ? ' vid' : '')} data-p={sl.pi} type="button" aria-label={sl.aria}><i style={{ backgroundImage: `url(${sl.thumb})` }}></i></button>
          ))}
        </div>
      </div>
    </section>
  )
}
