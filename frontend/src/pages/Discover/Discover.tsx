import "./Discover.scss";
import { useAuth0 } from "@auth0/auth0-react";

function Discover() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="discover-container">
      <div className="header">
        <h1>Ideapot</h1>
        <button onClick={() => loginWithRedirect()}>Enter Ideapot</button>
      </div>
    </div>
  );
}

export default Discover;
