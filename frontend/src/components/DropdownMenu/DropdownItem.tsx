import React, { useState } from "react";
import "./DropdownList.scss"

interface NavItemProps {
    icon: string | undefined;
    children?: React.ReactNode;
  }
  function DropdownItem(props: NavItemProps) {
      const [open, setOpen] = useState(false) 
    return (
      <li className="dropdown-item">
        <a href="#" className="icon-button" onClick={() => setOpen((prevState) => !prevState)}>
          {props.icon && <img src={props.icon}/>}
        </a>
        {open && props.children}
      </li>
    );
  }
  
  export default DropdownItem;