/* Mic utilitar: tot ce pornește un efect (listeneri, bucle, timere, observere)
   se oprește automat când blocul dispare din pagină. */
import { useEffect, useRef } from 'react'

export const LITE = typeof window !== 'undefined' && !!window.LITE
export const fine = () => matchMedia('(hover:hover) and (pointer:fine)').matches
export const coarse = () => matchMedia('(pointer:coarse)').matches

export function scope() {
  const ac = new AbortController(), timers = [], obs = []
  let dead = false
  const s = {
    get dead() { return dead },
    on(t, ev, fn, o) { t.addEventListener(ev, fn, { ...(o || {}), signal: ac.signal }) },
    loop(fn) { const f = (t) => { if (dead) return; fn(t); requestAnimationFrame(f) }; requestAnimationFrame(f) },
    every(fn, ms) { const id = setInterval(fn, ms); timers.push(id); return id },
    later(fn, ms) { const id = setTimeout(() => { if (!dead) fn() }, ms); timers.push(id); return id },
    watch(el, cb, opts) {
      if (!('IntersectionObserver' in window)) { cb(true); return }
      const o = new IntersectionObserver((e) => cb(e[e.length - 1].isIntersecting, e), opts || { rootMargin: '80px 0px' })
      o.observe(el); obs.push(o); return o
    },
    io(cb, opts) { const o = new IntersectionObserver(cb, opts); obs.push(o); return o },
    stop() { dead = true; ac.abort(); timers.forEach((id) => { clearInterval(id); clearTimeout(id) }); obs.forEach((o) => o.disconnect()) },
  }
  return s
}

/* Hook pentru blocuri: const ref = useFx((el, s) => { ...efect... }) */
export function useFx(init) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const s = scope()
    const extra = init(ref.current, s)
    return () => { s.stop(); if (typeof extra === 'function') extra() }
  }, [])
  return ref
}

/* Funcție comună: ruleaza fn la scroll, o dată pe cadru */
export function onScroll(s, fn) {
  let q = false
  const run = () => { q = false; fn() }
  s.on(window, 'scroll', () => { if (!q) { q = true; requestAnimationFrame(run) } }, { passive: true })
  s.on(window, 'resize', fn)
  fn()
}

export function slug(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
