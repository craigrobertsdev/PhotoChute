import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { io } from "socket.io-client";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/UserPage";
import Signup from "./pages/Signup";
import UserGroup from "./pages/UserGroup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Premium from "./pages/Premium";
import AuthChecker from "./components/AuthChecker";

// construct the GraphQL endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Constructs the request middleware forXattaching a JWT to every request as an authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// adds websocket connection to listen for confirmation of thumbnail being uploaded
// const socket = io("http://localhost:3001");
const socket = io();

function App() {
  const [thumbnailLoading, setThumbnailLoading] = useState(false);

  useEffect(() => {
    socket.on("thumbnail-created", thumbnailCreatedListener);
    return () => {
      socket.off("thumbnail-loading", thumbnailCreatedListener);
    };
  }, []);

  const thumbnailCreatedListener = (data) => {
    setThumbnailLoading(false);
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <div id="app-container" className="flex-column justify-flex-start min-100-vh bg">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/me"
              element={
                <AuthChecker>
                  <Profile />
                </AuthChecker>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/group"
              element={
                <AuthChecker>
                  <UserGroup
                    thumbnailLoading={thumbnailLoading}
                    setThumbnailLoading={setThumbnailLoading}
                  />
                </AuthChecker>
              }
            />
            <Route path="/premium" element={<Premium />} />
            <Route path="*" element={<h1 className="display-2">Wrong page!</h1>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
