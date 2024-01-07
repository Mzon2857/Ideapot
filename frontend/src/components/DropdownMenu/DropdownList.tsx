import { Link } from "react-router-dom";
import messagesimg from "../../envelope.png";
import bellimg from "../../bell.png";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./DropdownList.scss"
import DropdownItem from "./DropdownItem";
import DropdownMenu from "./DropdownMenu"; 


function DropdownList() {
  const { user } = useAuth0();

  return (
    <ul className="movedRight">
      <li>
        <Link to="/messages">
          <DropdownItem icon={messagesimg}/>
        </Link>
      </li>
      <li>
        <Link to="/notifications">
        <DropdownItem icon={bellimg}/>
        </Link>
      </li>
      <li>
        <Link to={`/${user?.nickname}`}>
        <div className="special-icon">
          <DropdownItem icon={user?.picture}>
            <DropdownMenu/>
          </DropdownItem>
        </div>
        </Link>
      </li>
    </ul>
  );
}
export default DropdownList;
