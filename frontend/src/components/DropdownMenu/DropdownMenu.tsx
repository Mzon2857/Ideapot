import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { CSSTransition } from "react-transition-group";
import "./DropdownList.scss";
import UserProfile from "../../assets/user.png";
import Settings from "../../assets/settings.png";
import Logout from "../../assets/log-out.png";
import DarkmodeImage from "../../assets/moon.png";
import LeftChevron from "../../assets/leftChevron.png";
import RightChevron from "../../assets/rightChevron.png";

interface NavItemProps {
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  goToMenu?: string;
}

function DropdownMenu() {
  const { user, logout } = useAuth0();
  const [activeMenu, setActiveMenu] = useState("main"); // Or 'settings'

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  function DropdownItem(props: NavItemProps) {
    const handleClick = () => {
      if (props.goToMenu) {
        setActiveMenu(props.goToMenu);
      }
    };
    return (
      <div className="menu-item" onClick={handleClick}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </div>
    );
  }

  return (
    <div className="dropdown">
      <CSSTransition
        in={activeMenu === "main"}
        unmountOnExit
        timeout={500}
        classNames="menu-primary"
      >
        <div className="menu">
          <DropdownItem leftIcon={<img src={UserProfile} alt="User Profile" />}>
            <Link to={`/${user?.nickname}`}>My Profile</Link>
          </DropdownItem>
          <DropdownItem
            leftIcon={<img src={Settings} alt="Settings" />}
            rightIcon={<img src={RightChevron} alt="Go inside menu" />}
            goToMenu="settings"
          >
            <Link to="/settings">Options</Link>
          </DropdownItem>
          <div onClick={handleLogout}>
            <DropdownItem leftIcon={<img src={Logout} alt="Log Out" />}>
              Logout
            </DropdownItem>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === "settings"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
      >
        <div className="menu">
          <DropdownItem
            leftIcon={<img src={LeftChevron} alt="Left Chevron" />}
            goToMenu="main"
          >
            Back
          </DropdownItem>
          <DropdownItem leftIcon={<img src={Settings} alt="Settings" />}>
            <Link to="/settings">Options</Link>
          </DropdownItem>
          <DropdownItem leftIcon={<img src={DarkmodeImage} alt="Dark Mode" />}>
            <Link to="/dark-mode">Dark Mode</Link>
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

export default DropdownMenu;
