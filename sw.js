const CACHE = 'daylift-v1';
const ASSETS = ['/', '/index.html', 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.url.includes('/api/'))return;
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, clone));
    return res;
  }).catch(() => caches.match('/index.html'))));
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {title:'Daylift',body:'Hey Pierre 💪'};
  e.waitUntil(self.registration.showNotification(data.title, {body:data.body,icon:'/icon.png',badge:'/icon.png',vibrate:[200,100,200],tag:data.tag||'daylift',renotify:true}));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
