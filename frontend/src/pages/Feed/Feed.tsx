import { useEffect, useState } from "react";
import ImageGrid from "../../components/ImageGrid/ImageGrid";
import { useAuthAxios } from "../../config/axiosConfig";

interface Image {
  id: number;
  s3ImageUrl: string;
  title: string;
  description: string;
}

function Feed() {
  const [images, setImages] = useState<Image[]>([]);

  const authAxios = useAuthAxios();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await authAxios.get(
          '/images/get-feed'
        );
        setImages(response.data);
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

export default Feed;
