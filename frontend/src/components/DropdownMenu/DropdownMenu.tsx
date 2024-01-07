import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { CSSTransition } from 'react-transition-group'; 
import "./DropdownList.scss";
import UserProfile from "../../user.png";
import Settings from "../../settings.png";
import Logout from "../../log-out.png";
import DarkmodeImage from "../../moon.png";
import LeftChevron from "../../leftChevron.png"
import RightChevron from "../../rightChevron.png"


interface NavItemProps {
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  goToMenu?: string;
}

function DropdownMenu() {
  const { user } = useAuth0();
  const [activeMenu, setActiveMenu] = useState('main'); // Or 'settings'

  function DropdownItem(props: NavItemProps) {
    const handleClick = () => {
        if (props.goToMenu) {
          setActiveMenu(props.goToMenu);
        }
      };
    return (
      <a href="#" className="menu-item" onClick={handleClick}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div className="dropdown">
      <CSSTransition in={activeMenu === 'main'} unmountOnExit timeout={500} classNames="menu-primary">
        <div className="menu">
          <DropdownItem leftIcon={<img src={UserProfile} alt="User Profile" />}>
            <Link to={`/${user?.nickname}`}>My Profile</Link>
          </DropdownItem>
          <DropdownItem 
          leftIcon={<img src={Settings} alt="Settings"/>} 
          rightIcon={<img src={RightChevron} alt="Go inside menu"/>} goToMenu="settings">
            <Link to="/settings">Options</Link>
          </DropdownItem>
          <DropdownItem leftIcon={<img src={Logout} alt="Log Out" />}>
            <Link to="/logout">Log out</Link>
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition in={activeMenu === 'settings'} unmountOnExit timeout={500} classNames="menu-secondary">
        <div className="menu">
        <DropdownItem leftIcon={<img src={LeftChevron} alt="Left Chevron"/>} goToMenu="main">Back</DropdownItem>
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
