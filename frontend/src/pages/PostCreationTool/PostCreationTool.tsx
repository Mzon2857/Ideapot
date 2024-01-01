import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './postCreationTool.scss'

const PostCreationTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {user} = useAuth0();

  //Retrieves userID from the email attached in auth0 token
  useEffect(() => {
    const fetchUserIdByEmail = async (email: string) =>{
      try{
        const response = await axios.get(`http://localhost:8080/api/users/by-email/${email}`);
        setUserId(response.data);
      } catch (error){
        console.error('Error fetching user id', error)
      }
    };

    if (user && user.email){
      fetchUserIdByEmail(user.email);
    }
  }, [user]);


  //File upload helpers
  const handleFileChange = (event: { target: { files: React.SetStateAction<null>[]; }; }) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('description', description);
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


  //Description box scaling
  const imagePreview = selectedFile ? URL.createObjectURL(selectedFile) : null;

  const textAreaRef = useRef(null);
  const textArea = textAreaRef.current;
  const handleTextAreaChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    textArea.style.height = textArea.scrollHeight + 'px';
    setDescription(event.target.value)
  };

  return (
    <div className="App">
    <header className="App-header">
      <h1>Post Creation Tool</h1>
      <div className="content-wrapper">
        <div className="upload-box">
          {imagePreview && <img src={imagePreview} alt="Preview" />}
          {!imagePreview && <div className="placeholder">Upload image</div>}
          <input id="file-upload" type="file" onChange={handleFileChange} />
        </div>
        <div className="text-inputs">
          <input 
              type="text" 
              placeholder="Title" 
              maxLength={50} 
              onChange={(e)=> setTitle(e.target.value)}
              className="text-input" />
          <textarea 
              ref={textAreaRef}
              placeholder="Description" 
              className="text-input"
              onChange={handleTextAreaChange}
              rows={3}
              maxLength={500}
            />
        </div>
      </div>
      <button onClick={handleUpload}>Publish</button>
    </header>
  </div>
  );
};

export default PostCreationTool;
