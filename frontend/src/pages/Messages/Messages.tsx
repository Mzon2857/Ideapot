import React from 'react';
import { useParams } from 'react-router-dom';

const Messages: React.FC = () => {
  let { username } = useParams<{ username: string }>();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Messages: {username}</h1>
      </header>
    </div>
  );
};

export default Messages;