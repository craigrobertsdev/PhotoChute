import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { PhotoChuteProvider, usePhotochuteContext } from "./utils/globalState";
import Home from "./pages/Home";
import Login from "./pages/Login";
<<<<<<< HEAD
import Azure from "./pages/azure";
=======
import Signup from "./pages/Signup";
>>>>>>> f36c76e4e8a2af89dac316a7b1d1be0be1c0a02b
import CreateGroupForm from "./pages/CreateGroupForm";
import UserGroup from "./pages/UserGroup";
import Header from "./components/Header";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

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
<<<<<<< HEAD
        <PhotoChuteProvider>
          <div className="flex-column justify-flex-start min-100-vh bg">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/azure" element={<Azure />} />
              <Route path="/create-group" element={<CreateGroupForm />} />
              <Route path="/group" element={<UserGroup />} />
              <Route path="*" element={<h1 className="display-2">Wrong page!</h1>} />
            </Routes>
            <Footer />
          </div>
        </PhotoChuteProvider>
=======
        <div className="flex-column justify-flex-start min-100-vh bg">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-group" element={<CreateGroupForm />} />
            <Route path="/group" element={<Group />} />
            <Route path="*" element={<h1 className="display-2">Wrong page!</h1>} />
          </Routes>
          <Footer />
        </div>
>>>>>>> f36c76e4e8a2af89dac316a7b1d1be0be1c0a02b
      </Router>
    </ApolloProvider>
  );
}

export default App;
