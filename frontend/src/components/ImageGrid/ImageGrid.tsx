import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './imageGrid.scss'

interface Image {
  id: number;
  s3ImageUrl: string;
  title: string;
  description: string;
}

const ImageGrid = ({ userId }) => {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/images/${userId}/get-images`
          );
          const data = await response.json();
          setImages(data);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };
    fetchImages();
  }, [userId]);

  return (
    <div className="ImageGrid-container ">
      {images.map((img, index) => (
        <Link to={`/images/${img.id}`} key={img.id}>
          <img src={img.s3ImageUrl} alt={`Gallery ${index}`} className="ImageGrid-image" />
        </Link>
      ))}
    </div>
  );
};

export default ImageGrid;
