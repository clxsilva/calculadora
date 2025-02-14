/**
 * Service Worker para o aplicativo de calculadora
 * @author Claudio Henrique e Yvis Trindade
 */

// Instalação (armazenamento em cache)
self.addEventListener('install ', (event) => {
    event.waitUntil(
        caches.open('static')
            .then((cache) => {
                cache.addAll([
                    '/calculadora/',
                    '/calculadora/index.html',
                    '/calculadora/style.css',
                    '/calculadora/app.js',
                    '/calculadora/img/favicon.ico'
                ]);
kwor            })
    );
});

// Ativação - Limpeza de caches antigos
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['static']; // Adicione os nomes das caches que você quer manter
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Limpa caches antigos
                    }
                })
            );
        }).then(() => {
            console.log("Cache antigo removido e service worker ativado!");
            return self.clients.claim();
        })
    );
});

// Interceptação de requisições e resposta com cache ou fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Resposta do cache:', event.request.url);
                    return response;  // Retorna do cache
                } else {
                    console.log('Fazendo fetch para:', event.request.url);
                    return fetch(event.request)  // Faz o fetch caso não esteja no cache
                        .then((fetchResponse) => {
                            return caches.open('dynamic').then((cache) => {
                                cache.put(event.request, fetchResponse.clone());  // Armazena no cache dinâmico
                                return fetchResponse;
                            });
                        });
                }
            })
    );
});
