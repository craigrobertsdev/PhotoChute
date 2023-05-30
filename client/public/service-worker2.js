/* eslint-disable no-restricted-globals */

var CACHE_NAME = "task-manager-pwa";
const staticCache = "static";
const imageCache = "images";
var urlsToCache = ["/"];

// Install service worker
self.addEventListener("install", (event) => {
  // Perform the install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Cache opened");
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache and return the requests
self.addEventListener("fetch", async (event) => {
  //   let reqUrl = event.request.url;
  //   const cacheRes = await caches.match(event.request);

  //   if (!reqUrl.startsWith("http")) {
  //     event.respondWith(fetch(event.request));
  //     return;
  //   }
  //   console.log(event);
  //   if (cacheRes) {
  //     return cacheRes;
  //   } else {
  //     const fetchResponse = await fetch(event.request);

  //     let type = fetchResponse.headers.get("content-type");
  //     console.log({
  //       event: { ...event },
  //       cacheRes,
  //       fetchResponse,
  //       type,
  //     });

  //     try {
  //       if (
  //         type &&
  //         (type.match(/^text\/css/i) ||
  //           type.match(/^application\//i) ||
  //           event.request.url.match(/fonts.googleapis.com/i))
  //       ) {
  //         //css to save in dynamic cache
  //         console.log(`save a static file ${event.request.url}`);
  //         const cache = await caches.open(staticCache);
  //         await cache.put(event.request, fetchResponse.clone());
  //         return event.respondWith(fetchResponse);
  //       } else if (
  //         (type && type.match(/^font\//i)) ||
  //         event.request.url.match(/fonts.gstatic.com/i)
  //       ) {
  //         console.log(`save a FONT file ${event.request.url}`);
  //         const cache = await caches.open(staticCache);
  //         await cache.put(event.request, fetchResponse.clone());
  //         return event.respondWith(fetchResponse);
  //       } else if ((type && type.match(/^image\//i)) || reqUrl.startsWith("https://photochute")) {
  //         //save in image cache
  //         console.log(`save an IMAGE file ${event.request.url}`);
  //         const cache = await caches.open(imageCache);
  //         await cache.put(event.request, fetchResponse.clone());
  //         return event.respondWith(fetchResponse);
  //       } else {
  //         //save in dynamic cache
  //         console.log(`OTHER save ${event.request.url}`);
  //         const cache = await caches.open(staticCache);
  //         await cache.put(event.request, fetchResponse.clone());
  //         return event.respondWith(fetchResponse);
  //       }
  //     } catch (err) {
  //       console.error(err, fetchResponse, event);
  //     }
  //   }
  // });
  console.log(event);
  event.respondWith(
    caches.match(checkImageUrl(event.request)).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(event.request).then((fetchResponse) => {
          let type = fetchResponse.headers.get("content-type");
          let reqUrl = event.request.url;
          if (
            (type && type.match(/^text\/css/i)) ||
            event.request.url.match(/fonts.googleapis.com/i)
          ) {
            //css to save in dynamic cache
            console.log(`save a CSS file ${event.request.url}`);
            return caches.open(staticCache).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          } else if (
            (type && type.match(/^font\//i)) ||
            event.request.url.match(/fonts.gstatic.com/i)
          ) {
            console.log(`save a FONT file ${event.request.url}`);
            return caches.open(staticCache).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          } else if ((type && type.match(/^image\//i)) || reqUrl.startsWith("https://photochute")) {
            //save in image cache
            console.log(`save an IMAGE file ${event.request.url}`);
            return caches.open(imageCache).then((cache) => {
              if (reqUrl.startsWith("https://photochute")) {
                cache.put(reqUrl.slice(0, reqUrl.lastIndexOf("?")), fetchResponse.clone());
              } else {
                cache.put(event.request, fetchResponse.clone());
              }
              return fetchResponse;
            });
          } else {
            //save in dynamic cache
            console.log(`OTHER save ${event.request.url}`);
            return caches.open(staticCache).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          }
        })
      );
    })
  );
});

// Update service worker
self.addEventListener("activate", (event) => {
  var cacheWhitelist = ["task-manager-pwa"];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

function checkImageUrl(eventRequest) {
  return eventRequest;
}
