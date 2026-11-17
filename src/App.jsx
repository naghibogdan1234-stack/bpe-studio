import { blocks } from './blocks/index.js'
import { pages } from './site.config.jsx'
import Overlays from './components/Overlays.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { useFx } from './effects/scope.js'
import { initSite } from './effects/site.js'

/* Desenează toate paginile din site.config.jsx; meniul arată una singură odată. */
function Blocks({ page }) {
  return page.blocks.map((b, i) => {
    const Block = blocks[b.type]
    if (!Block) { console.warn('Bloc necunoscut:', b.type); return null }
    return <Block key={page.id + i} view={page.id} {...b.props} />
  })
}

export default function App() {
  /* efectele globale pornesc după ce toate blocurile sunt pe pagină */
  const ref = useFx((el, s) => initSite(el, s, pages))
  return (
    <div ref={ref}>
      <Overlays />
      <Header pages={pages} />
      <main>{pages.map((p) => <Blocks key={p.id} page={p} />)}</main>
      <Footer />
    </div>
  )
}
