import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import './App.scss';
import logo from './assets/react.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx'
import UserProfile from './pages/UserProfile/UserProfile';
import PostCreationTool from './pages/PostCreationTool/PostCreationTool';
import Discover from './pages/Discover/Discover'
import Notifications from './pages/Notifications/Notifications';
import Messages from './pages/Messages/Messages';
import ImageDetail from './pages/ImageDetail/ImageDetail.tsx';

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

  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: import.meta.env.VITE_AUTH0_SCOPE,
        });
        setAccessToken(token);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
      }
    };

    const postUser = async () =>{
      if (isAuthenticated && user){
        try {
          const token = await getAccessTokenSilently();
          await fetch("http://localhost:8080/api/users/create", {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-type': 'application/json',
            },
            body: JSON.stringify(user),
          });
        } catch (error){
          console.log('Error posting user to backend: ', error);
        }
      }
    }

    if (isAuthenticated) {
      getAccessToken();
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post-creation-tool" element={<PostCreationTool />} />
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/discover" element= {<Discover/>} />
        <Route path="/notifications" element = {<Notifications />} />
        <Route path="/messages" element = {<Messages />} />
        <Route path="/images/:imageId" element={<ImageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
