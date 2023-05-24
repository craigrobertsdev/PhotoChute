import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SavedBooks from "./pages/SavedBooks";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";

// construct the GraphQL endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

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
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh bg">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route path="*" element={<h1 className="display-2">Wrong page!</h1>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
