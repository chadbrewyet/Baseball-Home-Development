const CACHE="clubhouse-v9";
const ASSETS=["./","./index.html","./styles.css","./app.js","./db.js","./manifest.webmanifest","./assets/icon.svg","./assets/icon-192.png","./assets/icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.mode==="navigate"||/\.(html|css|js)$/i.test(new URL(req.url).pathname)){
    e.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res}).catch(()=>caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
