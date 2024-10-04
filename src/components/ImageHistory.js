import React from "react";
import "./ImageHistory.css";

function ImageHistory({ onSelectImage, imageHistory }) {
  const handleSelectImage = (image) => {
    onSelectImage(image);
  };

  return (
    <div className="image-history">
      <div className="history-scroll">
        {imageHistory.map((imageData, index) => (
          <div
            key={index}
            className="history-item"
            onClick={() => handleSelectImage(imageData)}
          >
            <img
              src={imageData.output.images[0].url}
              alt={`Generated ${index + 1}`}
            />

            <p className="history-item-prompt"> {imageData.output.prompt} </p>
            <p className="history-item-timestamp">
              {imageData.input.timestamp}
            </p>

            <div className="history-item-details">
              <p className="history-item-size">
                Size: {imageData.output.images[0].height} x{" "}
                {imageData.output.images[0].width}
              </p>
              <p className="history-item-model">
                Model: {imageData.input.model}
              </p>
              <p className="history-item-steps">
                Steps: {imageData.input.numInferenceSteps}
              </p>
              <p className="history-item-guidance">
                Guidance: {imageData.input.guidanceScale}
              </p>
              <p className="history-item-seed">Seed: {imageData.output.seed}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageHistory;
