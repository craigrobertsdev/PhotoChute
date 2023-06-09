import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-lg-6 col-sm-12">
        <div>
          {data ? (
            <p>
              Success! You may now head <Link to="/">back to the homepage.</Link>
            </p>
          ) : (
            <form className="signup-form" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="firstName">First Name:</label>
                <input
                  className="form-input"
                  name="firstName"
                  type="text"
                  value={formState.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName">Last Name:</label>
                <input
                  className="form-input"
                  name="lastName"
                  type="text"
                  value={formState.lastName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  className="form-input"
                  name="username"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
              </div>
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
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  className="form-input"
                  name="phoneNumber"
                  type="number"
                  value={formState.phoneNumber}
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
                  Already have an account?
                  <Link className="m-2" to="/login">
                    Login Here!
                  </Link>
                </p>
              </div>
            </form>
          )}

          {error && (
            <div className="my-3 p-3 bg-danger text-white bRadius text-center">{error.message}</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Signup;
