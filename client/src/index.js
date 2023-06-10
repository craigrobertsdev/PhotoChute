import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { register } from "../src/serviceWorkerRegistration";

//register();

function LocalServiceWorkerRegister() {
  const swPath = `${process.env.PUBLIC_URL}/sw.js`;
  if ("serviceWorker" in navigator && process.env.NODE_ENV !== "production") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(swPath).then(
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

LocalServiceWorkerRegister();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
