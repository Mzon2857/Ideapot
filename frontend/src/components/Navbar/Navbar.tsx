import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Notifications from "../../pages/Notifications/Notifications";
import Messages from "../../pages/Messages/Messages";
const Navbar: React.FC = () => {
  const { user } = useAuth0();

  return (
    <nav className="Navbar">
      <img src="{logo}" alt="{logo}" className="logo" />

      <ul>
        <li>
          <Link to="/discover">
            <button>
              <i>Discover</i>
            </button>
          </Link>
        </li>
        <li>
          <Link to="/post-creation-tool">
            <button>Create</button>
          </Link>
        </li>
        <li>
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <img src="" alt="" />
        </div>
        </li>
      </ul>

      <Link to={`/${user?.nickname}`}>
        <button>{user?.given_name}</button>
      </Link>
      <Link to='/messages'>
        <button>Messages</button>
      </Link>
      <Link to='/notifications'>
        <button>Notifications</button>
      </Link>
    </nav>
  );
};

export default Navbar;
