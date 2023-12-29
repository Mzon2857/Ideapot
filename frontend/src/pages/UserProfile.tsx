import React from 'react';
import { useParams } from 'react-router-dom';

const UserProfile: React.FC = () => {
  let { username } = useParams<{ username: string }>();

  return (
    <div className="App">
      <header className="App-header">
        <h1>User Profile: {username}</h1>
      </header>
    </div>
  );
};

export default UserProfile;
