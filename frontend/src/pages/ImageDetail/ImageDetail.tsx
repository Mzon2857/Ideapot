import React from 'react';
import { useParams } from 'react-router-dom';

const ImageDetail: React.FC = () => {
    let { imageId } = useParams<{ imageId: string }>();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Info: {imageId}</h1>
      </header>
    </div>
  );
};

export default ImageDetail;