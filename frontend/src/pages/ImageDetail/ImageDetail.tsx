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

interface User {
  id: number;
  username: string;
  picture: string;
}

interface Comment {
  id: number;
  user: User;
  text: string;
}

interface CommentDTO {
  user: User;
  text: string;
}

const ImageDetail: React.FC = () => {
  let { imageId } = useParams();
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const [userId, setUserId] = useState(0);
  const { user } = useAuth0();

  const authAxios = useAuthAxios();

  const handleLike = async () => {
    try {
      if (liked == false) {
        const likeRequest: LikeDTO = {
          userId: userId,
          imageId: Number(imageId),
        };
        console.log(likeRequest);
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
      if (liked == true) {
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

  const handleAddComment = async () => {
    try {
      const commentRequest: CommentDTO = {
        user: { id: userId, username: user.name, picture: user.picture },
        text: newComment,
      };
      await authAxios.post(`/images/${imageId}/comment`, commentRequest);
      setComments([
        ...comments,
        { id: Date.now(), user: user, text: newComment },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    const fetchImageDetails = async () => {
      if (!user || !user.email || !imageId) return;

      try {
        const userResponse = await authAxios.get(
          `/users/by-email/${user.email}`
        );
        const fetchedUserId = userResponse.data;
        setUserId(fetchedUserId);

        const imageResponse = await authAxios.get(
          `/images/get-image/${imageId}`,
          { params: { userId: fetchedUserId } }
        );
        setImage(imageResponse.data);
        setLiked(imageResponse.data.userLiked);
        setLikesCount(imageResponse.data.likes || 0);
      } catch (error) {
        console.error("Error fetching user id or image details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await authAxios.get(`/images/${imageId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchImageDetails();
    fetchComments();
  }, [user, imageId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ImagePage">
      <header className="ImagePage-header">
        <div className="image">
          {image && <img src={image.s3ImageUrl} alt={image.title} />}
        </div>
        <div className="details">
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
          <h2>Comments</h2>
          <div className="comments-section">
            <div className="comments">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <Link
                    to={`/${comment.user.username}`}
                    className="comment-user"
                  >
                    {comment.user ? (
                      <>
                        <img
                          src={comment.user.picture}
                          alt={comment.user.username}
                        />
                        <span>{comment.user.username}</span>
                      </>
                    ) : (
                      <span>Unknown User</span>
                    )}
                  </Link>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
              />
              <button onClick={handleAddComment}>Post Comment</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default ImageDetail;
