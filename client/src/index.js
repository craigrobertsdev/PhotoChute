import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// serviceWorkerRegistration.register();
LocalServiceWorkerRegister();

export function LocalServiceWorkerRegister() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV !== "production") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker2.js").then(
        function (registration) {
          // Registration was successful
          console.log("ServiceWorker registration successful with scope: ", registration.scope);
        },
        function (err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    });
  }
}
