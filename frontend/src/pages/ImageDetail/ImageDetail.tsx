import React, { useEffect, useState } from "react";
import { useParams, Link  } from "react-router-dom";
import "./imageDetail.scss";

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

const ImageDetail: React.FC = () => {
  let { imageId } = useParams();
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/images/get-image/${imageId}`
        );
        if (!response.ok) {
          throw new Error("Image not found.");
        }
        const data = await response.json();
        setImage(data);
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

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
            <Link to={`/${image.posterInfo.username}`} className="poster-details">
              <img src={image.posterInfo.picture} alt="Poster" />
              {image.posterInfo.username}
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default ImageDetail;
