import { Link } from 'react-router-dom';
import './imageGrid.scss'

interface Image {
  id: number;
  s3ImageUrl: string;
  title: string;
  description: string;
}

interface ImageGridProps {
  images: Image[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
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
