import React, { useState, useCallback, useRef, useEffect } from "react";
import './ImageDisplay.css';
import './ImageHistory.css';

function ImageDisplay({ generationResult, status, selectedImage, onDeleteImage }) {
  const prompt = generationResult?.input?.prompt || selectedImage?.prompt || "generated_image";
  const [isMaximized, setIsMaximized] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleContainerClick = (e) => {
    if (e.target === containerRef.current) {
      setIsMaximized(false);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (isMaximized) {
      setIsDragging(true);
      setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newX = e.clientX - startPosition.x;
      const newY = e.clientY - startPosition.y;
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, startPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isMaximized) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMaximized, handleMouseMove, handleMouseUp]);

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (!isMaximized) {
      setIsMaximized(true);
    }
  };

  const downloadImage = (url, fileName) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  // ... (keep all the existing functions like toggleMaximize, handleZoom, etc.)

  const renderStatus = () => {
    switch (status) {
      case "noApiKey":
        return <div className="status-message">Please enter an API key to get started.</div>;
      case "idle":
        return null;
      case "generating":
        return <div className="status-message">Generating image... Please wait.</div>;
      default:
        return null;
    }
  };

  const renderPlaceholder = () => (
    <div className="image-placeholder">
      <p>No image generated yet. Use the form above to generate an image or select one from the history below.</p>
    </div>
  );

  const imagesToDisplay = selectedImage ? [selectedImage] : (generationResult?.images || []);

  return (
    <div className="image-display-container">
      {renderStatus()}
      <div className="image-display">
        {imagesToDisplay.length > 0 ? (
          imagesToDisplay.map((image, index) => (
            <div key={index}>
              <div
                className={`image-container ${isMaximized ? "maximized" : ""}`}
                ref={containerRef}
                onClick={handleContainerClick}
                onMouseDown={handleMouseDown}
                style={{ cursor: isMaximized ? "default" : "pointer" }}
              >
                <img
                  ref={imageRef}
                  src={image.url}
                  alt={`Generated ${index + 1}`}
                  onClick={handleImageClick}
                  style={{
                    transform: `scale(${scale})`,
                    transition: "transform 0.3s ease",
                    transformOrigin: "0 0",
                    position: "relative",
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    cursor: isMaximized ? "move" : "pointer",
                  }}
                />
                {isMaximized && (
                  <div className="zoom-instructions">
                    <p>Drag to move around</p>
                    <p>Use mouse wheel to zoom in/out</p>
                    <p>Click outside the image to close</p>
                  </div>
                )}
              </div>
              <div className="button-container">
                <button
                  onClick={() => downloadImage(image.url, prompt)}
                  className="download-button"
                >
                  Download Image
                </button>
                {selectedImage && (
                  <button
                    onClick={() => onDeleteImage(image)}
                    className="delete-button"
                  >
                    Delete Image
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          renderPlaceholder()
        )}
      </div>
    </div>
  );
}

export default ImageDisplay;
