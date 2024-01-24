import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.scss";
import logoimg from "../../assets/ithenaLogo.png";
import searchimg from "../../assets/search.png";
import DropdownList from "../DropdownMenu/DropdownList.tsx";

const Navbar: React.FC = () => {

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="Navbar">
      <Link to="/">
        <img
          src={logoimg}
          alt="Logo"
          className="logo"
          style={{ maxWidth: "80px", maxHeight: "100px" }}
        />
      </Link>
      <ul className="leftSide">
        <li>
          <Link to="/">
            <button style={isActive('/') ? { backgroundColor: 'black', color: 'white' } : {}}>
              <p>Home</p>
            </button>
          </Link>
        </li>
        <li>
          <Link to="/post-creation-tool">
            <button style={isActive('/post-creation-tool') ? { backgroundColor: 'black', color: 'white' } : {}}>
              Create
            </button>
          </Link>
        </li>
        <li>
          <div className="search-box">
            <img src={searchimg} alt="" />
            <input type="text" placeholder="Search" />
          </div>
        </li>
      </ul>

      <DropdownList />
      
    </nav>
  );
};

export default Navbar;
