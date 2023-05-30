import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from "react-bootstrap";


const Profile = () => {
  const [photoCount, setPhotoCount] = useState(0);
  const [maxPhotos, setMaxPhotos] = useState(15);
  return (
    <div className="flex-row justify-center mb-4">
      <div className='col-8'>
        <h2 className='altHeading'>Storage</h2>
        <ProgressBar
          now={photoCount}
          max={maxPhotos}
          label={`${photoCount ? photoCount : 0}/${maxPhotos}`}
          className='progBar'
        />
      </div>
      <div className='col-8 mt-3' >
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
            <div className='row'>
              <div className="submitBtn">
                <button
                  className="btn"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                  to="/User"
                >
                  Submit
                </button>
              </div>
              <div className='submitBtn'>
                <Link className="homeJoin m-2" to="/User">Cancel</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Profile;