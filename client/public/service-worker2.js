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
      // console.log("Cache opened");
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache and return the requests
self.addEventListener("fetch", async (event) => {
  if (!event.request.url.startsWith("http") || event.request.method === "POST") {
    event.respondWith(fetch(event.request));
  } else {
    // checks to see whether the requested url begins with "https://photochute". if so, returns the appropriate image, ignoring the query string
    const cacheRes = await checkImageUrl(event.request);
    if (cacheRes) {
      event.respondWith(cacheRes);
      return;
    } else {
      event.respondWith(
        fetch(event.request).then((fetchResponse) => {
          let type = fetchResponse.headers.get("content-type");
          let reqUrl = event.request.url;
          if (
            (type && type.match(/^text\/css/i)) ||
            event.request.url.match(/fonts.googleapis.com/i)
          ) {
            //css to save in dynamic cache
            // console.log(`save a CSS file ${event.request.url}`);
            return caches.open(staticCache).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          } else if (
            (type && type.match(/^font\//i)) ||
            event.request.url.match(/fonts.gstatic.com/i)
          ) {
            // console.log(`save a FONT file ${event.request.url}`);
            return caches.open(staticCache).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          } else if ((type && type.match(/^image\//i)) || reqUrl.startsWith("https://photochute")) {
            //save in image cache
            // console.log(`save an IMAGE file ${event.request.url}`);
            return caches.open(imageCache).then((cache) => {
              // if (reqUrl.startsWith("https://photochute")) {
              //   console.log(reqUrl);
              //   console.log("event.request", event.request);
              //   console.log(event);
              //   console.log("type", type);
              //   const responseBlob = fetchResponse
              //     .clone()
              //     .blob()
              //     .then((blob) => blob);
              //   const updatedResponse = fetchResponse.clone();
              //   updatedResponse.body = responseBlob;
              //   console.log(updatedResponse);
              //   updatedResponse.blob();
              //   cache.put(reqUrl.slice(0, reqUrl.lastIndexOf("?")), fetchResponse.clone());
              // } else {
              // console.log("fetchResponse", fetchResponse);
              cache.put(event.request, fetchResponse.clone());
              // }
              return fetchResponse;
            });
          } else {
            try {
              //save in dynamic cache
              // console.log(`OTHER save ${event.request.url}`);
              if (!fetchResponse) {
                // console.log("No fetch response");
              }
              return caches.open(staticCache).then((cache) => {
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
              });
            } catch (err) {
              // console.error(err);
            }
          }
        })
      );
    }
  }
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

async function checkImageUrl(eventRequest) {
  console.log(eventRequest);
  if (eventRequest.url.startsWith("https://photochute")) {
    const imageCache = await caches.open("images");
    console.log("imageCache", await imageCache.keys());

    const url = eventRequest.url.slice(0, eventRequest.url.lastIndexOf("?"));
    return await caches.match(url);
  }

  return await caches.match(eventRequest);
}
