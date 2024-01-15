import { useEffect, useState } from "react";
import "./Discover.scss"
import ImageGrid from "../../components/ImageGrid/ImageGrid";
import { useAuthAxios } from "../../config/axiosConfig";
import Visuals from "../../assets/Visuals.mp4"
import { Link } from "react-router-dom";

interface Image {
  id: number;
  s3ImageUrl: string;
  title: string;
  description: string;
}

function Discover() {
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
      <video src={Visuals} width="100%" height="calc(100vh - 60px)" autoPlay muted loop />
      <div className="heading">
      <p>Welcome to Ideapot</p>
      <Link to="/feed">
      <button>Get inspired...</button>
      </Link>
      </div>  
    </div>
  );
}

export default Discover;
