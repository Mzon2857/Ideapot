import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./imageDetail.scss";
import { useAuthAxios } from "../../config/axiosConfig";
import { useAuth0 } from "@auth0/auth0-react";

interface PosterInfo {
  username: string;
  picture: string;
}

interface ImageData {
  s3ImageUrl: string;
  title: string;
  description: string;
  posterInfo: PosterInfo;
}

interface LikeDTO {
  userId: number;
  imageId: number;
}

const ImageDetail: React.FC = () => {
  let { imageId } = useParams();
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [userId, setUserId] = useState(0);
  const {user} = useAuth0();

  const authAxios = useAuthAxios();

  const handleLike = async () => {
    try {
      if (liked == false){
        const likeRequest: LikeDTO = {
          userId: userId,
          imageId: Number(imageId),
        };
        console.log(likeRequest)
        await authAxios.post(`/images/${imageId}/like`, likeRequest);
        setLiked(true);
        setLikesCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error liking image:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      if (liked == true){
        const likeRequest: LikeDTO = {
          userId: userId,
          imageId: Number(imageId),
        };
        await authAxios.post(`/images/${imageId}/unlike`, likeRequest);
        setLiked(false);
        setLikesCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error unliking image: ", error);
    }
  };

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!user || !user.email || !imageId) return;
  
      try {
        const userResponse = await authAxios.get(`/users/by-email/${user.email}`);
        const fetchedUserId = userResponse.data;
        setUserId(fetchedUserId);
  
        const imageResponse = await authAxios.get(`/images/get-image/${imageId}`, { params: { userId: fetchedUserId } });
        setImage(imageResponse.data);
        setLiked(imageResponse.data.userLiked);
        setLikesCount(imageResponse.data.likes || 0);
      } catch (error) {
        console.error("Error fetching user id or image details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchImageDetails();
  }, [user, imageId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ImagePage">
      <header className="ImagePage-header">
        {image && <img src={image.s3ImageUrl} alt={image.title} />}
        <div className="image-details">
          <h1>{image?.title}</h1>
          <p>{image?.description}</p>
          {image?.posterInfo && (
            <Link
              to={`/${image.posterInfo.username}`}
              className="poster-details"
            >
              <img src={image.posterInfo.picture} alt="Poster" />
              {image.posterInfo.username}
            </Link>
          )}
          <div className="like-button">
            {liked ? (
              <button onClick={handleUnlike}>Unlike</button>
            ) : (
              <button onClick={handleLike}>Like</button>
            )}
            <span>{likesCount}</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default ImageDetail;
