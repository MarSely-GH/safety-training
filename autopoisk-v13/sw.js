const CACHE="autopoisk-v13-design5";
const ASSETS=["./","./index.html","./manifest.json","./icon.svg","./hero-truck.svg?kp12=20260820-1","./app.js","./base1.js","./base2.js","./base3.js","./base4.js"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));self.skipWaiting();});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith("/hero-truck.svg")){
    event.respondWith(fetch("./hero-truck.svg?kp12=20260820-1",{cache:"reload"}).catch(()=>caches.match("./hero-truck.svg?kp12=20260820-1")));
    return;
  }
  event.respondWith(fetch(req).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});return resp;}).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));
});