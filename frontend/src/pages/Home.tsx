import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from '../components/Navbar/Navbar';

const Main: React.FC = () => {
  const { user, logout } = useAuth0();

  const securedAPITest = async () => {
    console.log("Testing API");
  };

  const handleLogout = () => {
    logout();
    window.location.href = window.location.origin;
  };

  return (
    <div className="App">
      <div className="container">
        <Navbar/>
      </div>
      <header className="App-header">
        <p>Hi {user?.email}, You have successfully logged in.</p>
        <button onClick={securedAPITest}>Test Private API</button>
        <button onClick={handleLogout}>Logout</button>
      </header>
    </div>
  );
};

export default Main;
