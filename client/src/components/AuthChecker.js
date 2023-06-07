import React from "react";
import auth from "../utils/auth";
import Login from "../pages/Login";

const AuthChecker = ({ children }) => {
  const loggedIn = auth.loggedIn();

  if (!loggedIn) {
    return <Login />;
  }

  return children;
};

export default AuthChecker;
