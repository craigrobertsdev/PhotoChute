import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { EDIT_USER } from '../utils/mutations';
// import { Navigate, useParams } from 'react-router-dom';
// import { useQuery } from '@apollo/client';

import Auth from '../utils/auth';

const Profile = () => {
  // const { username: userParam } = useParams();

  // const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
  //   variables: { username: userParam },
  // });

  // const user = data?.me || data?.user || {};
  // navigate to personal profile page if username is yours
  // if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
  //   return <Navigate to="/me" />;
  // }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!user?.username) {
  //   return (
  //     <h4>
  //       You need to be logged in to see this. Use the navigation links above to
  //       sign up or log in!
  //     </h4>
  //   );

  // const [formState, setFormState] = useState({
  //   username: '',
  //   email: '',
  //   password: '',
  // });
  // const [editUser, { error, data }] = useMutation(EDIT_USER);

  // const handleChange = (event) => {
  //   const { name, value } = event.target;

  //   setFormState({
  //     ...formState,
  //     [name]: value,
  //   });
  // };

  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log(formState);

  //   try {
  //     const { data } = await editUser({
  //       variables: { ...formState },
  //     });

  //     Auth.login(data.addUser.token);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <div className="flex-row justify-center mb-4">
      <div className='col-8'>
        <h2 className='altHeading'>Storage</h2>
        <p>Storage Bar</p>
      </div>
      <div className='col-8'>
      <h2 className='altHeading'>Update Details</h2>
      </div>
      <div className="col-6">
        <form>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              className="form-input"
              // placeholder="Username"
              name="username"
              type="text"
              // value={formState.name}  
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              className="form-input"
              // placeholder="email"
              name="email"
              type="email"
              // value={formState.email}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              className="form-input"
              // placeholder="phone number"
              name="phoneNumber"
              type="number"
              // value={formState.phoneNumber}
              // onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              className="form-input"
              // placeholder="********"
              name="password"
              type="password"
              // value={formState.password}
              // onChange={handleChange}
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
          <Link className="homeJoin m-2" to="/User">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
