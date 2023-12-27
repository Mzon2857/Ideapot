import React from 'react'
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Auth0Provider } from "@auth0/auth0-react";
import configData from "./config.json";

const container = document.getElementById('root');
const root = createRoot(container!); 

const providerConfig = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN!,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
  redirectUri: window.location.origin,
  useRefreshTokens: true,
  cacheLocation: "localstorage" as const
};

root.render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);