import React from 'react';

function ImageHistory({ onSelectImage, imageHistory }) {
  const handleSelectImage = (image) => {
    onSelectImage(image);
  };

  return (
    <div className="image-history">
      <h3>Image History</h3>
      <div className="history-scroll">
        {imageHistory.map((image, index) => (
          <div key={index} className="history-item" onClick={() => handleSelectImage(image)}>
            <img src={image.url} alt={`Generated ${index + 1}`} />
            <div className="history-item-details">
              <p className="history-item-prompt">{image.prompt.substring(0, 50)}...</p>
              <p className="history-item-timestamp">{new Date(image.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageHistory;
