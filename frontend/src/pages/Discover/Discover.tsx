import { useEffect, useState } from "react";
import ImageGrid from "../../components/ImageGrid/ImageGrid";

interface Image {
  id: number;
  s3ImageUrl: string;
  title: string;
  description: string;
}

function Discover() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/api/images/get-feed'
        );
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="discover-container">
      <ImageGrid images={images} />
    </div>
  );
}

export default Discover;
