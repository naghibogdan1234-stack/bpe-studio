/* Contact: numărul mare, cine răspunde și câteva rânduri scurte. */
export default function Contact({ view, phone, tel, who, items }) {
  return (
    <section className="contact" data-view={view} id="contact" aria-label="Contact">
      <div className="cl">
        <a className="bigl rv" href={'tel:' + tel}>{phone}</a>
        <p className="bigl who rv" style={{ '--i': 1 }}>{who}</p>
      </div>
      <div className="cr rv">
        {items.map((it, i) => <p key={i}><b>{it.title}</b>{it.text}</p>)}
      </div>
    </section>
  )
}
