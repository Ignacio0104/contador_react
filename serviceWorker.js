const CACHE_ELEMENTS = [ //Aca indicamos la direcciones de donde queremso guardar los datos 
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./estilo.css",
    "./components/Contador.js",
];

const CACHE_NAME = "v3_cache_contador_react";

self.addEventListener("install", (e)=> //install es la "inicializacion del service worker" 
{
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache=>{
            cache.addAll(CACHE_ELEMENTS).then(()=>{
                self.skipWaiting();
            }).catch(err=>console.log(err));
        })
    );
}) ;

self.addEventListener("activate", (e)=> 
{
    const cacheWhiteList=[CACHE_NAME];
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(cacheName =>{
                return cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName) //&& es un if sin else
            }))
        }).then(()=> self.clients.claim()) //Aca le decimos a la pagina que las dir indicadas los traiga desde cache storage
    );
});

self.addEventListener("fetch", (e)=>  //buscar las nuevas versiones de nuestros archivos
{
    console.log(e.request);
   e.respondWith(
   caches.match(e.request).then((res)=> res ? res : fetch(e.request)) //Si res existe, mostrar res. Sino, lo consigue de internet
   )
});