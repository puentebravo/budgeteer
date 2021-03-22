self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll(["/", "/index.html", "/styles.css", "/index.js"]);
    })
  );
  console.log("Install");
  self.skipWaiting()
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then( response => {
      return response || fetch(event.request);
    })
  );
});
// / Write code to allow storage of data in index DB/passing to database.