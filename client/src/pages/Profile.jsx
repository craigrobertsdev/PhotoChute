import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
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
