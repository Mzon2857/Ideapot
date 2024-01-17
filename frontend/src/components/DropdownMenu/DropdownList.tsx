import { Link } from "react-router-dom";
import messagesimg from "../../assets/envelope.png";
import bellimg from "../../assets/bell.png";
import dropDownIcon from "../../assets/downArrow.png";
import { useAuth0 } from "@auth0/auth0-react";
import "./DropdownList.scss";
import DropdownItem from "./DropdownItem";
import DropdownMenu from "./DropdownMenu";

function DropdownList() {
  const { user } = useAuth0();

  return (
    <ul className="rightSide">
      <li>
        <Link to="/messages">
          <DropdownItem icon={messagesimg} />
        </Link>
      </li>
      <li>
        <Link to="/notifications">
          <DropdownItem icon={bellimg} />
        </Link>
      </li>
      <li>
        <Link to={`/${user?.nickname}`}>
          <img src={user?.picture} alt={user?.name} className="user-profile-image" />
        </Link>
      </li>
      <li>
        <div className="special-icon">
          <DropdownItem icon={dropDownIcon}>
            <DropdownMenu />
          </DropdownItem>
        </div>
      </li>
    </ul>
  );
}
export default DropdownList;
