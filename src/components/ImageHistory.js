import React from 'react';

function ImageHistory({ onSelectImage, imageHistory }) {
  const handleSelectImage = (image) => {
    onSelectImage(image);
  };

  return (
    <div className="image-history">
      <h3>Image History</h3>
      <div className="history-scroll">
        {imageHistory.map((imageData, index) => (
          <div key={index} className="history-item" onClick={() => handleSelectImage(imageData)}>
            <img src={imageData.images[0].url} alt={`Generated ${index + 1}`} />
            <div className="history-item-details">
              <p className="history-item-prompt">{imageData.requestData.prompt.substring(0, 50)}...</p>
              <p className="history-item-timestamp">{new Date(imageData.timestamp).toLocaleString()}</p>
              <p className="history-item-model">Model: {imageData.requestData.model}</p>
              <p className="history-item-size">Size: {imageData.requestData.imageSize.width}x{imageData.requestData.imageSize.height}</p>
              <p className="history-item-steps">Steps: {imageData.requestData.numInferenceSteps}</p>
              <p className="history-item-guidance">Guidance: {imageData.requestData.guidanceScale}</p>
              <p className="history-item-seed">Seed: {imageData.requestData.seed || 'Random'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageHistory;
