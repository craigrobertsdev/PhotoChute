import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
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
    console.log(formState);

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
      <div className="col-8">
          <div>
            {data ? (
              <p>
                Success! You may now head{' '}
                <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label for="firstName">First Name:</label>
                  <input
                    className="form-input"
                    // placeholder="Username"
                    name="firstName"
                    type="text"
                    value={formState.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label for="lastName">Last Name:</label>
                  <input
                    className="form-input"
                    // placeholder="Username"
                    name="lastName"
                    type="text"
                    value={formState.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label for="username">Username:</label>
                  <input
                    className="form-input"
                    // placeholder="Username"
                    name="username"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label for="email">Email:</label>
                  <input
                    className="form-input"
                    // placeholder="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label for="phoneNumber">Phone Number:</label>
                  <input
                    className="form-input"
                    // placeholder="phone number"
                    name="phoneNumber"
                    type="number"
                    value={formState.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label for="password">Password:</label>
                  <input
                    className="form-input"
                    // placeholder="********"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="submitBtn">
                  <button
                    className="btn"
                    style={{ cursor: 'pointer' }}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
                <div className='loginLink'>
                  <p>Already have an account?<Link className="m-2" to="/login">Login Here!</Link></p>
                </div>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
    </main>
  );
};

export default Signup;
