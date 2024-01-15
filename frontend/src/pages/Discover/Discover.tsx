import { useEffect, useState } from "react";
import "./Discover.scss";
import Visuals from "../../assets/Visuals.mp4";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Discover() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="discover-container">
      <video
        src={Visuals}
        width="100%"
        height="calc(100vh - 60px)"
        autoPlay
        muted
        loop
      />
      <div className="heading">
        <p>Welcome to Ideapot</p>
        <button onClick={() => loginWithRedirect()}>Get inspired...</button>
      </div>
    </div>
  );
}

export default Discover;
