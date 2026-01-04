/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'ql-inmobiliaria-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Error al cachear archivos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia: Network First, fallback a Cache
self.addEventListener('fetch', (event) => {
  // Solo cachear peticiones GET y URLs válidas (excluir chrome-extension, etc)
  const isValidRequest = event.request.method === 'GET' && 
                         event.request.url.startsWith('http');
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Solo cachear si es una petición válida y la respuesta es exitosa
        if (isValidRequest && response.status === 200) {
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            })
            .catch((error) => {
              console.log('Error al cachear:', error);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Si falla la red, buscar en cache (solo para peticiones GET)
        if (isValidRequest) {
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Si no está en cache, devolver página offline
              return caches.match('/index.html');
            });
        }
        // Para peticiones no-GET, simplemente retornar error
        return new Response('Network error', { status: 408 });
      })
  );
});
