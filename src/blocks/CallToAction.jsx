import { SplitHeading } from '../components/Text.jsx'

/* Banda albastră cu un titlu, un text și un buton. */
export default function CallToAction({ view, title, text, button }) {
  return (
    <section className="next" data-view={view} aria-labelledby="nx">
      <SplitHeading id="nx" text={title} />
      <div><p className="rv">{text}</p>{button && <a className="btn white rv" style={{ '--i': 1 }} href={button.href}>{button.label}</a>}</div>
    </section>
  )
}
