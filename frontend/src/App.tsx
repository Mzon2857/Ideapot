import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.scss";
import logo from "./assets/react.svg";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import UserProfile from "./pages/UserProfile/UserProfile";
import PostCreationTool from "./pages/PostCreationTool/PostCreationTool";
import Discover from "./pages/Discover/Discover";
import Notifications from "./pages/Notifications/Notifications";
import Messages from "./pages/Messages/Messages";
import ImageDetail from "./pages/ImageDetail/ImageDetail.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import axios from "axios";

const App: React.FC = () => {
  const {
    isLoading,
    error,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();

  useEffect(() => {
    const postUser = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently({
            audience: "testapi28588",
            scope: "openid profile email",
          });

          console.log("Token:", token);

          const response = await axios.post(
            "http://localhost:8080/api/private/users/create",
            user,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status != 201) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error posting user to backend: ", error);
        }
      }
    };
    if (isAuthenticated) {
      postUser();
    }
  }, [getAccessTokenSilently, isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <code>React</code>
          </p>
          <button onClick={() => loginWithRedirect()}>Log In</button>
        </header>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/post-creation-tool" element={<PostCreationTool />} />
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/images/:imageId" element={<ImageDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
