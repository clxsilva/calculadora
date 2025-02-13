/**
 * Service worker para o aplicativo de calculadora
 * @author Claudio Henrique e Yvis Trindade
 */

// Instalação (cache "armazenamento local")
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('static')
        .then((cache) => {
            // Cache de todos os arquivos necessários
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/app.js',
                '/img/logo.png'  // A logo do aplicativo
            ]);
        })
    );
});

// Ativação
self.addEventListener('activate', (event) => {
    console.log("Service Worker ativado", event);
    return self.clients.claim();  // Garantir que o service worker seja ativado imediatamente
});

// Interceptação de requisições e resposta com cache quando estiver offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (response) {
                // Retorna a resposta do cache, se disponível
                return response;
            } else {
                // Se não estiver em cache, faz o fetch da requisição normalmente
                return fetch(event.request);
            }
        })
    );
});
