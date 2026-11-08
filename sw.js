const CACHE='pricepulse-v7';
const ASSETS=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  if(e.request.method!=='GET')return;
  if(/\.apk($|\?)/.test(u)||/\/download\//.test(u)||/[?&]chk=/.test(u))return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request.mode==='navigate'?u:e.request,{cache:'no-cache'}).then(r=>{if(r&&r.status===200){const k=r.clone();caches.open(CACHE).then(c=>c.put(e.request,k))}return r}).catch(()=>hit);
    return hit||net;
  }));
});
