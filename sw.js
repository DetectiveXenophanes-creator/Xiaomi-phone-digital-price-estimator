const CACHE='pricepulse-v3';
const ASSETS=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(/\.apk($|\?)/.test(e.request.url)||/download\.html/.test(e.request.url))return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(r=>{if(r&&r.status===200){const k=r.clone();caches.open(CACHE).then(c=>c.put(e.request,k))}return r}).catch(()=>hit);
    return hit||net;
  }));
});
