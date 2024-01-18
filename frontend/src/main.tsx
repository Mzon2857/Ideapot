import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.tsx'
import './styles/index.scss'
import { Auth0Provider } from "@auth0/auth0-react";

const container = document.getElementById('root');
const root = createRoot(container!); 

root.render(
  <React.StrictMode>
    <Auth0Provider 
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_PUBLIC_AUTH0_AUDIENCE,
        scope: import.meta.env.VITE_AUTH0_SCOPE
    }}>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);