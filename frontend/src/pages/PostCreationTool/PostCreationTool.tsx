import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import "./postCreationTool.scss";
import { useAuthAxios } from "../../config/axiosConfig";

interface IFileChangeEvent {
  target: { files: FileList };
}

interface ITextChangeEvent {
  target: { value: string };
}

const PostCreationTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const { user } = useAuth0();

  const authAxios = useAuthAxios();

  //Retrieves userID from the email attached in auth0 token
  useEffect(() => {
    const fetchUserIdByEmail = async (email: string) => {
      try {
        const response = await authAxios.get(`/users/by-email/${email}`);
        setUserId(response.data);
      } catch (error) {
        console.error("Error fetching user id", error);
      }
    };

    if (user && user.email) {
      fetchUserIdByEmail(user.email);
    }
  }, [user]);

  //File upload helpers
  const handleFileChange = (event: IFileChangeEvent) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);
    formData.append("description", description);
    try {
      const response = await authAxios.post(
        `/images/${userId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  //Description box scaling
  const imagePreview = selectedFile ? URL.createObjectURL(selectedFile) : null;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleTextAreaChange = (event: ITextChangeEvent) => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
    setDescription(event.target.value);
  };

  //dallE generation
  const handleGenerateImage = async () => {
    try {
      const response = await authAxios.post(
        "/images/generate-dalle-image",
        null,
        {
          params: { prompt },
        }
      );
      setGeneratedImageUrl(response.data);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image");
    }
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
              onChange={(e) => setTitle(e.target.value)}
              className="text-input"
            />
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
        <div className="prompt-input">
          <input
            type="text"
            placeholder="Enter prompt for image generation"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-input"
          />
          <button onClick={handleGenerateImage}>Generate Image</button>
        </div>
        {generatedImageUrl && <img src={generatedImageUrl} alt="Generated" />}
        <button onClick={handleUpload}>Publish</button>
      </header>
    </div>
  );
};

export default PostCreationTool;
