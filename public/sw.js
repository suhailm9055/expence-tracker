const CACHE_NAME = "expense-tracker-v3";
const APP_SHELL = ["/dashboard", "/manifest.json", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for navigation requests, falling back to the cached
// dashboard shell (and then the offline page) when there's no connection.
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(new Request(event.request))
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || caches.match("/offline.html");
        })
    );
  }
});
