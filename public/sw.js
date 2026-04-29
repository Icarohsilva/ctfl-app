const CACHE_NAME = "testpath-v1";
const STATIC_CACHE = "testpath-static-v1";

// Arquivos para cache offline
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/login",
  "/offline",
];

// Instala o service worker e faz cache dos assets estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Ignora erros de cache no install
      });
    })
  );
  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-HTTP, APIs externas e Supabase
  if (
    !request.url.startsWith("http") ||
    url.hostname.includes("supabase") ||
    url.hostname.includes("groq") ||
    url.hostname.includes("google") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Estratégia: Network First para páginas, Cache First para assets
  if (request.destination === "document") {
    // Páginas: tenta rede primeiro, fallback para cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match("/offline");
          });
        })
    );
  } else if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image"
  ) {
    // Assets: cache first
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            return response;
          })
        );
      })
    );
  }
});

// Recebe notificações push
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "Hora de estudar! 📖",
    icon: "/icons/web-app-manifest-192x192.png",
    badge: "/icons/favicon-96x96.png",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/dashboard" },
    actions: [
      { action: "estudar", title: "Estudar agora →" },
      { action: "depois", title: "Mais tarde" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "TestPath", options)
  );
});

// Clique na notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "depois") return;

  const url = event.notification.data?.url || "/dashboard";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});