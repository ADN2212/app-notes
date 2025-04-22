// const CACHE_NAME = 'notes-app-cache';

// //console.log(self)
// self.addEventListener('install', (e) => {
//     console.log('Instalando el serviceworker !!')
//     e.waitUntil(
//         caches.open(CACHE_NAME).then(
//             cache => {
//                 return cache.addAll([
//                     '/',
//                     '/index.html',
//                 ]).then(
//                     () => self.skipWaiting()
//                 )
//             }
//         )
//     )
// })

// self.addEventListener('activate', (e) => {
//     console.log('Activando el service worker !!')
//     e.waitUntil(self.clients.claim())
// })

// self.addEventListener('fetch', async function(event) {

//     console.log(`Se ha hecho una peticion a ${event.request.url}`)

//     if (navigator.onLine) {
//         console.log('Estamos en linea !!')

//     } else {
//         console.log('No hay internet : (')
//         console.log('Capturando peticion')

//         const idb = await openDataBase()

//         console.log(idb)
        
//     }
// })

// function openDataBase() {
//     return new Promise((resolve, reject) => {
//       const request = indexedDB.open('note-queue -db', 1);
  
//       request.onupgradeneeded = (event) => {
//         const db = event.target.result;
//         if (!db.objectStoreNames.contains('queue ')) {
//           db.createObjectStore('queue ', { keyPath: 'id', autoIncrement: true });
//         }
//       };
  
//       request.onsuccess = (event) => resolve(event.target.result);
//       request.onerror = (event) => reject(event.target.error);
//     });
//   }
  
//   async function enqueueRequest(request) {
//     const db = await abrirDB();
//     const tx = db.transaction('queue ', 'readwrite');
//     const store = tx.objectStore('queue ');
  
//     const body = await request.clone().json();
//     const data = {
//       url: request.url,
//       method: request.method,
//       body,
//       fecha: Date.now(),
//     };
  
//     store.add(data);
  
//     return tx.complete;
//   }
