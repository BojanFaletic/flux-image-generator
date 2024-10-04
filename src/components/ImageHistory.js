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
            <img src={imageData.images?.[0]?.url || ''} alt={`Generated ${index + 1}`} />
            <div className="history-item-details">
              <p className="history-item-prompt">{(imageData.requestData?.prompt || '').substring(0, 50)}...</p>
              <p className="history-item-timestamp">{new Date(imageData.timestamp || Date.now()).toLocaleString()}</p>
              <p className="history-item-model">Model: {imageData.requestData?.model || 'Unknown'}</p>
              <p className="history-item-size">Size: {imageData.requestData?.imageSize?.width || 'N/A'}x{imageData.requestData?.imageSize?.height || 'N/A'}</p>
              <p className="history-item-steps">Steps: {imageData.requestData?.numInferenceSteps || 'N/A'}</p>
              <p className="history-item-guidance">Guidance: {imageData.requestData?.guidanceScale || 'N/A'}</p>
              <p className="history-item-seed">Seed: {imageData.requestData?.seed || 'Random'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageHistory;
