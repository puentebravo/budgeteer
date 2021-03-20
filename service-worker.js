self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll(["./", "./index.html", "./styles.css", "./index.js"]);
    })
  );
  console.log("Install");
  self.skipWwaiting();
});

