import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LocalStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import CreateGroupForm from "./pages/CreateGroupForm";
import User from "./pages/UserPage";
import UserGroup from "./pages/UserGroup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Premium from "./pages/Premium";

// construct the GraphQL endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

const cache = new InMemoryCache();

// await before instantiating ApolloClient, else queries might run before the cache is persisted
const persistor = new CachePersistor({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});
// await persistCache({
//   cache,
//   storage: new LocalStorageWrapper(window.localStorage),
// });

// Constructs the request middleware for attaching a JWT to every request as an authorization header
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
  cache,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh bg">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/me" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-group" element={<CreateGroupForm />} />
            <Route path="/user" element={<User />} />
            <Route path="/group" element={<UserGroup />} />
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
