// Development mode: remove old offline caches and unregister this worker.
// Re-enable app-shell caching only when the app is ready for production/PWA testing.
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(
  caches.keys()
    .then(keys=>Promise.all(keys.map(key=>caches.delete(key))))
    .then(()=>self.registration.unregister())
    .then(()=>self.clients.matchAll({type:"window"}))
    .then(clients=>clients.forEach(client=>client.navigate(client.url)))
));
self.addEventListener("fetch",()=>{});
