import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const PostCreationTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState('');
  const {user} = useAuth0();

  useEffect(() => {
    const fetchUserIdByEmail = async (email) =>{
      try{
        const response = await axios.get(`http://localhost:8080/api/users/by-email/${email}`);
        setUserId(response.data.id);
      } catch (error){
        console.error('Error fetching user id', error)
      }
    };

    if (user && user.email){
      fetchUserIdByEmail(user.email);
    }
  }, [user]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post(`http://localhost:8080/api/images/${userId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Post Creation Tool</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Image</button>
      </header>
    </div>
  );
};

export default PostCreationTool;
