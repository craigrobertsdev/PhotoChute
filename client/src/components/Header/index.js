import React from 'react';
import { Link } from 'react-router-dom';

import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header className="bg-header text-light mb-4 py-3 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link className='title-link' to="/">
            <h1 className="m-0">Photo<span style={{color:"#47294C"}}>Chute</span></h1>
          </Link>
        </div>
        <div>
          {Auth.loggedIn() ? (
            <>
              <Link className="navBtn m-2" to="/me">
                Profile
              </Link>
              <Link className="navBtn m-2" to="/me">
                Get Premium
              </Link>
              <button className="navBtn btn-logout m-2" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="navBtn m-2" to="/login">
                Login
              </Link>
              <Link className="navBtn m-2" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
