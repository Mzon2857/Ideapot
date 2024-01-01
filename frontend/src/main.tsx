import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.tsx'
import './styles/index.scss'
import { Auth0Provider } from "@auth0/auth0-react";

const container = document.getElementById('root');
const root = createRoot(container!); 

const providerConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
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