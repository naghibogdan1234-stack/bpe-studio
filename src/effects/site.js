/* Efectele globale ale site-ului (nu țin de un singur bloc):
   preloader, navigarea între pagini cu cortina albastră, apariția elementelor .rv,
   bara de progres, cursorul, butoanele magnetice, ceasul/salutul, "butonul care cere atenție".
   Rulează o singură dată, după ce toate blocurile sunt pe pagină. */
import { LITE, fine, onScroll } from './scope.js'

export function initSite(root, s, pages) {
  const D = document, d = D.documentElement, rm = LITE

  /* preloader: numără până la 100, apoi intră titlul */
  const pc = D.getElementById('pc')
  if (rm) d.classList.add('go')
  else {
    let t0 = null
    const tick = (t) => { if (s.dead) return; t0 = t0 || t; const k = Math.min(1, (t - t0) / 1400); if (pc) pc.textContent = Math.round(100 * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
    s.later(() => d.classList.add('go'), 1650)
  }

  /* elementele cu clasa .rv apar când intră în ecran */
  const els = D.querySelectorAll('.rv')
  if ('IntersectionObserver' in window) {
    const io = s.io((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    els.forEach((e) => io.observe(e))
  } else els.forEach((e) => e.classList.add('in'))

  /* ceas, salut și "Suntem online" după ora din Târgu Mureș */
  function clock() {
    let t; try { t = new Intl.DateTimeFormat('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' }).format(new Date()) } catch (e) { t = '' }
    D.querySelectorAll('[data-clock]').forEach((n) => { n.textContent = t })
  }
  function hour() { try { return parseInt(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Europe/Bucharest' }).format(new Date()), 10) } catch (e) { return new Date().getHours() } }
  function life() {
    const h = hour(), g = h < 5 ? 'Noapte bună' : h < 11 ? 'Bună dimineața' : h < 18 ? 'Bună ziua' : 'Bună seara', on = h >= 9 && h < 21
    D.querySelectorAll('[data-greet]').forEach((n) => { n.textContent = g + ' din Târgu Mureș' })
    D.querySelectorAll('[data-status]').forEach((n) => { n.textContent = on ? 'Suntem online' : 'Revenim la 9:00'; n.parentNode.classList.toggle('off', !on) })
  }
  clock(); life(); s.every(clock, 20000); s.every(life, 60000)

  /* titlul tab-ului vorbește când pleci */
  const title = D.title
  s.on(D, 'visibilitychange', () => { D.title = D.hidden ? 'Te așteptăm înapoi · BPE Studio' : title })

  /* bara de progres de sus */
  const bar = D.getElementById('bar')
  onScroll(s, () => { const h = d.scrollHeight - innerHeight; if (bar) bar.style.setProperty('--p', (h > 0 ? scrollY / h : 0).toFixed(4)) })

  /* cursor custom + butoane magnetice */
  if (fine() && !rm) {
    const cur = D.getElementById('cur'), c2 = D.getElementById('cur2')
    let mx = 0, my = 0, cx = 0, cy = 0, rx = 0, ry = 0
    s.on(window, 'pointermove', (e) => { mx = e.clientX; my = e.clientY; if (!cur.classList.contains('on')) { cx = mx; cy = my; cur.classList.add('on') } })
    s.loop(() => {
      cx += (mx - cx) * .35; cy += (my - cy) * .35; rx += (mx - rx) * .13; ry += (my - ry) * .13
      cur.style.transform = `translate(${cx}px,${cy}px)`; c2.style.transform = `translate(${rx}px,${ry}px)`
      if (cur.classList.contains('on') && !c2.classList.contains('on')) { rx = mx; ry = my; c2.classList.add('on') }
      c2.classList.toggle('big', cur.classList.contains('big'))
    })
    D.querySelectorAll('.btn').forEach((b) => {
      s.on(b, 'pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transition = 'translate 260ms cubic-bezier(.23,1,.32,1),transform 160ms,color 250ms'; b.style.translate = ((e.clientX - r.left - r.width / 2) * .28).toFixed(1) + 'px ' + ((e.clientY - r.top - r.height / 2) * .4).toFixed(1) + 'px' })
      s.on(b, 'pointerleave', () => { b.style.translate = '0px 0px' })
    })
    D.querySelectorAll('a,button,input').forEach((el) => {
      s.on(el, 'pointerenter', () => cur.classList.add('big')); s.on(el, 'pointerleave', () => cur.classList.remove('big'))
    })
  }

  /* când nu faci nimic 7 secunde, cel mai apropiat buton cere atenție */
  let last = Date.now()
  ;['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((n) => s.on(window, n, () => { last = Date.now() }, { passive: true }))
  if (!rm) s.every(() => {
    if (D.hidden || Date.now() - last < 7000) return
    const bs = D.querySelectorAll('[data-view].show .btn')
    for (let i = 0; i < bs.length; i++) {
      const r = bs[i].getBoundingClientRect()
      if (r.top > 70 && r.bottom < innerHeight && r.width) { const b = bs[i]; b.classList.add('nudge'); s.later(() => b.classList.remove('nudge'), 950); break }
    }
    last = Date.now() - 3500
  }, 1200)

  /* paginile: meniul arată o singură pagină odată (#lucrari, #cum, ...) */
  const MAP = {}, NAMES = {}
  pages.forEach((p) => { MAP[p.hash] = p.id; NAMES[p.id] = p.label })
  const home = pages[0].id
  const views = D.querySelectorAll('[data-view]'), navs = D.querySelectorAll('[data-go]')
  let curV = null, busy = false
  function show(v, jump) {
    if (v === curV) return; curV = v
    views.forEach((el) => el.classList.toggle('show', el.getAttribute('data-view') === v))
    navs.forEach((a) => { const on = a.getAttribute('data-go') === v; a.classList.toggle('cur', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current') })
    if (jump) { scrollTo({ top: 0, behavior: 'instant' }); s.later(() => scrollTo({ top: 0, behavior: 'instant' }), 30) }
    dispatchEvent(new Event('resize'))
  }
  const wipe = D.getElementById('wipe')
  function go(v) {
    if (v === curV) return
    if (rm || !wipe.animate || busy) { show(v, true); return }
    busy = true; wipe.firstChild.textContent = NAMES[v] || ''
    const E = 'cubic-bezier(.77,0,.175,1)'
    const a = wipe.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 520, easing: E, fill: 'forwards' })
    wipe.firstChild.animate([{ transform: 'translateY(60%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, delay: 120, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'both' })
    a.onfinish = () => { show(v, true); const b = wipe.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 620, delay: 260, easing: E, fill: 'forwards' }); b.onfinish = () => { busy = false } }
  }
  const fromHash = () => MAP[location.hash.replace('#', '')] || home
  s.on(window, 'hashchange', () => go(fromHash()))
  show(fromHash(), false)
  const goHome = (e) => { e.preventDefault(); if (location.hash) history.pushState(null, '', location.pathname + location.search); go(home) }
  D.querySelectorAll('.mark,[data-go="' + home + '"]').forEach((a) => s.on(a, 'click', goHome))
  const top = D.getElementById('top')
  if (top) s.on(top, 'click', (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' }) })
}
