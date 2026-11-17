import { site } from '../content/site.js'

/* Meniul se construiește singur din lista de pagini (pages din site.config.jsx). */
export default function Header({ pages }) {
  return (
    <header className="hd" id="hd">
      <a className="mark" href="#">{site.name}</a>
      <nav className="links" aria-label="Principal">
        {pages.filter((p) => p.nav !== false).map((p) => (
          <a key={p.id} href={'#' + p.hash} data-go={p.id}>
            <span className="o"><span className="t">{p.label}</span></span>
          </a>
        ))}
      </nav>
      <div className="hd-r">
        <span className="live"><i></i><span data-status>{site.city}</span><span data-clock>--:--</span></span>
        <a className="btn sm" href="#contact">Contact</a>
      </div>
    </header>
  )
}
