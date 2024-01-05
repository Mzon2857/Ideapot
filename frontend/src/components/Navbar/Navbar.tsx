import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import Notifications from "../../pages/Notifications/Notifications";
import Messages from "../../pages/Messages/Messages";
import logo from "../../ithenaLogo.png"
import search from "../../search.png"
import messages from "../../messageImg.png"
import notifications from "../../bell.png"

const Navbar: React.FC = () => {
  const { user } = useAuth0();

  return (
    <nav className="Navbar">
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" style={{ maxWidth: '80px', maxHeight: '100px' }} />
      </Link>
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
          <img src={search} alt=""/>
          <input type="text" placeholder="Search" />
        </div>
        </li>
      </ul>


      <ul className = "movedRight">
        <li>
      <Link to='/messages'>
        <img src = {messages} alt =""/>
      </Link>
        </li>
        <li>
        <Link to='/notifications'>
          <img src = {notifications} alt = ""/>
        </Link>
        </li>
        <li>
      <Link to={`/${user?.nickname}`}>
        <img src = {user?.picture} alt = ""/>      
      </Link>
      </li>
      </ul>
    </nav>
  );
};

export default Navbar;
