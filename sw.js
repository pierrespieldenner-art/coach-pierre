self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {title:'Coach Pierre',body:'Hey Pierre 💪'};
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'coach',
    renotify: true
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});

// Scheduled notifications via periodic sync
self.addEventListener('periodicsync', e => {
  if(e.tag === 'daily-reminders') {
    e.waitUntil(checkAndNotify());
  }
});

async function checkAndNotify() {
  const now = new Date();
  const h = now.getHours();
  const notifications = [];
  if(h === 6) notifications.push({title:'🏃 Coach Pierre', body:'Bonne séance ! Départ dans 30 min.', tag:'morning'});
  if(h === 10) notifications.push({title:'💧 Hydratation', body:'Tu as bu combien de verres ce matin ?', tag:'water'});
  if(h === 13) notifications.push({title:'🥗 Repas de midi', body:'N\'oublie pas de noter ton repas au coach.', tag:'lunch'});
  if(h === 16) notifications.push({title:'💧 Eau', body:'Mi-journée — objectif eau atteint ?', tag:'water2'});
  if(h === 22) notifications.push({title:'😴 Coucher', body:'Bientôt l\'heure de dormir. Note ta journée ?', tag:'sleep'});
  for(const n of notifications) {
    await self.registration.showNotification(n.title, {body:n.body, icon:'/icon.png', tag:n.tag, vibrate:[200,100,200]});
  }
}
