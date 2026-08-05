const CACHE_NAME = "is800-beam-checker-v19";
const ASSETS = [
  "./",
  "./index.html",
  "./login.html",
  "./signup.html",
  "./admin.html",
  "./help.html",
  "./feedback.html",
  "./payment-success.html",
  "./pay-daily.html",
  "./pay-monthly.html",
  "./pay-yearly.html",
  "./select-code.html",
  "./select-module.html",
  "./firebase-config.js",
  "./auth-guard.js",
  "./translations.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// NETWORK-FIRST for HTML and JS (the files that change often): always try
// to fetch the latest version first. Only fall back to the cached copy if
// the network request fails (i.e. the device is offline). This guarantees
// that whenever the user is online, they always see the newest deployed
// version — no more stuck-on-old-version caching issues after an update.
// Images/icons/manifest stay cache-first since they rarely change and
// benefit more from instant loading.
const NETWORK_FIRST_EXT = [".html", ".js", ".json"];

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = e.request.url;
  const isNetworkFirst = NETWORK_FIRST_EXT.some((ext) => url.includes(ext)) || url.endsWith("/");

  if (isNetworkFirst) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
          return res;
        });
      })
    );
  }
});
