import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user } = useAuth0();

  return (
    <nav className="App-nav">
      <Link to="/post-creation-tool">
        <button>Post Creation Tool</button>
      </Link>

      <Link to={`/${user?.nickname}`}>
        <button>Your Profile</button>
      </Link>
    </nav>
  );
};

export default Navbar;
