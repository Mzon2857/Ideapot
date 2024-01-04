import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./userProfile.scss";
import axios from "axios";
import ImageGrid from "../../components/ImageGrid/ImageGrid";

interface Image {
  id: number;
  s3ImageUrl: string;
  title: string;
  description: string;
}

interface User {
  id: number;
  username: string;
  picture: string;
}

const UserProfile: React.FC = () => {
  let { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User>();
  const [images, setImages] = useState<Image[]>([]);
  
  //Retrieves userID from the email attached in auth0 token
  useEffect(() => {
    const fetchUserIdByUsername = async (username: string) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/by-nickname/${username}`
        );
        setUser(response.data);
        console.log(user);
      } catch (error) {
        console.error("Error fetching user id", error);
      }
    };

    fetchUserIdByUsername(username);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      if (user?.id) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/images/${user.id}/get-images`
          );
          const data = await response.json();
          setImages(data);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };
    fetchImages();
  }, [user]);

  return (
    <div className="UserProfile-container">
      {user && (
        <>
        <header className="UserProfile-header">
          <img src={user.picture} alt="User" className="UserProfile-picture" />
          <div className="UserProfile-username">{username}</div>
        </header>
        <ImageGrid images={images}/>
        </>
      )}
    </div>
  );
};

export default UserProfile;
