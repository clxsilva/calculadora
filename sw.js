/**
 * Service Worker para o aplicativo de calculadora
 * @author Claudio Henrique e Yvis Trindade
 */

// Instalação (armazenamento em cache)
self.addEventListener('install', (event) => {
    console.log("Instalando Service Worker...");

    event.waitUntil(
        caches.open('static')  // Define o nome do cache
        .then((cache) => {
            return cache.addAll([
                '/',  // Página principal
                '/index.html',  // Arquivo HTML
                '/style.css',  // Arquivo CSS
                '/app.js',  // Arquivo JS
                '/img/logo.png'  // Logo do aplicativo
            ]);
        })
    );
});

// Ativação
self.addEventListener('activate', (event) => {
    console.log("Service Worker ativado", event);
    return self.clients.claim();  // Garante que o service worker seja ativado imediatamente
});

// Interceptação de requisições e resposta com cache quando estiver offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if (response) {
                console.log('Resposta do cache:', event.request.url);
                return response;  // Retorna a resposta do cache
            } else {
                console.log('Fazendo fetch para:', event.request.url);
                return fetch(event.request);  // Faz o fetch caso o arquivo não esteja no cache
            }
        })
    );
});
