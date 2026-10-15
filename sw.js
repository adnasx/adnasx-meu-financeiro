// Guarda só o código do app para abrir sem internet. Nunca guarda dados financeiros.
const V = 'mf-v2'
self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(V).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest'])))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', (e) => {
  const r = e.request
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return
  e.respondWith(
    fetch(r).then((res) => { const copy = res.clone(); caches.open(V).then((c) => c.put(r, copy)); return res })
      .catch(() => caches.match(r).then((m) => m || caches.match('./index.html')))
  )
})
