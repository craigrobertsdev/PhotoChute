import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Login = (props) => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);

      // clear form values
      setFormState({
        email: "",
        password: "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-sm-12 col-lg-6">
        <div>
          {data ? (
            <p>
              Success! You may now head <Link to="/">back to the homepage.</Link>
            </p>
          ) : (
            <form className="signup-form" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  className="form-input"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  className="form-input"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
              </div>

              <div className="submitBtn">
                <button className="btn" style={{ cursor: "pointer" }} type="submit">
                  Submit
                </button>
              </div>
              <div className="loginLink">
                <p>
                  Don't have an account?
                  <Link className="m-2" to="/signup">
                    Sign up Here!
                  </Link>
                </p>
              </div>
            </form>
          )}

          {error && (
            <div className="my-3 p-3 bg-danger text-center text-white bRadius">{error.message}</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;
