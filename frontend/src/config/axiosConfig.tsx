import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export const useAuthAxios = () => {
  const { getAccessTokenSilently } = useAuth0();

  const instance = axios.create({
    baseURL: 'http://localhost:8080/api/private',
  });

  instance.interceptors.request.use(async (config) => {
    const token = await getAccessTokenSilently({
      audience: "testapi28588",
      scope: "openid profile email",
    });
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return instance;
};
