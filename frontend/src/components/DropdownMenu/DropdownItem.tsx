import React, { useState } from "react";
import "./DropdownList.scss";

interface NavItemProps {
  icon: string | undefined;
  children?: React.ReactNode;
  asListItem?: boolean;
}

function DropdownItem(props: NavItemProps) {
  const [open, setOpen] = useState(false);
  const Element = props.asListItem ? 'li' : 'div';

  return (
    <Element className="dropdown-item">
      <button
        className="icon-button"
        onClick={() => setOpen((prevState) => !prevState)}
      >
        {props.icon && <img src={props.icon} alt="Icon" />}
      </button>
      {open && props.children}
    </Element>
  );
}

export default DropdownItem;
