import React, { useState, useEffect } from "react";
import { submitInferenceRequest, configureFal } from "../../api/fal_ai";
import { MODELS } from "../constants";

function ImageForm({ onSubmit, apiKey, onGenerationStart, selectedModel, onModelChange }) {
  const IMAGE_SIZES = {
    "Default": "1024x1024",
    "Square": "1024x1024",
    "Square HD": "1536x1536",
    "Portrait 3:4": "768x1024",
    "Portrait 9:16": "576x1024",
    "Landscape 4:3": "1024x768",
    "Landscape 16:9": "1024x576",
    "Custom": "custom"
  };

  const [selectedSize, setSelectedSize] = useState("Default");
  const [customResolution, setCustomResolution] = useState("");

  const [localNumInferenceSteps, setLocalNumInferenceSteps] = useState(28);
  const [seed, setSeed] = useState("random");
  const [localGuidanceScale, setLocalGuidanceScale] = useState(3.5);
  const [localNumImages, setLocalNumImages] = useState(1);

  const [localPrompt, setLocalPrompt] = useState("");

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleCustomResolutionChange = (event) => {
    setCustomResolution(event.target.value);
  };

  useEffect(() => {
    if (apiKey) {
      configureFal(apiKey);
    }
  }, [apiKey]);

  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    try {
      console.log("Submitting inference request...");
      let size;
      if (selectedSize === "Custom") {
        const [width, height] = customResolution.split('x').map(Number);
        if (isNaN(width) || isNaN(height)) {
          throw new Error("Invalid custom resolution");
        }
        size = { width, height };
      } else {
        const [width, height] = IMAGE_SIZES[selectedSize].split('x').map(Number);
        size = { width, height };
      }

      if (!localPrompt.trim()) {
        throw new Error("Prompt cannot be empty");
      }

      const requestData = {
        prompt: localPrompt,
        imageSize: size,
        numImages: localNumImages,
        guidanceScale: localGuidanceScale,
        safetyTolerance: 6,
        numInferenceSteps: localNumInferenceSteps,
        enableSafetyChecker: false,
        seed: seed === "random" ? null : parseInt(seed)
      };

      const result = await submitInferenceRequest(
        requestData.prompt,
        { width: requestData.imageSize.width, height: requestData.imageSize.height },
        requestData.numImages,
        requestData.guidanceScale,
        requestData.safetyTolerance,
        requestData.numInferenceSteps,
        requestData.enableSafetyChecker,
        requestData.seed,
        MODELS[selectedModel]
      );

      console.log("Inference request result:", result);

      const completeImageData = {
        output: {
          ...result
        },

        input: {
          ...requestData,
          model: selectedModel,
          timestamp: new Date().toISOString()
        },
      };

      onSubmit(completeImageData);

      console.log("Inference request submitted successfully.");

    } catch (error) {
      console.error("Error during submission:", error);
      setError(`An error occurred while submitting the request: ${error.message}`);
    }
  };
  return (
    <div className="image-form">
      <div className="prompt-container">
        <textarea
          className="prompt-textarea"
          placeholder="Enter your prompt here..."
          value={localPrompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
        ></textarea>
        <button className="prompt-enter-button" onClick={handleSubmit}>Submit</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="form-dropdown">
        <label>
          Number of Inference Steps:
          <input
            type="number"
            value={localNumInferenceSteps}
            onChange={(e) => setLocalNumInferenceSteps(parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </label>
        <label>
          Seed:
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="random or specific number"
          />
        </label>
        <label>
          Guidance Scale:
          <input
            type="number"
            value={localGuidanceScale}
            onChange={(e) => setLocalGuidanceScale(parseFloat(e.target.value))}
            step="0.1"
            min="0"
            max="10"
          />
        </label>
        <label>
          Number of Images:
          <input
            type="number"
            value={localNumImages}
            onChange={(e) => setLocalNumImages(parseInt(e.target.value))}
            min="1"
            max="1"
          />
        </label>
      </div>
      <div className="additional-settings">
        <label>
          Image Size:
          <div className="image-size-buttons">
            {Object.keys(IMAGE_SIZES).map((size) => (
              <button
                key={size}
                className={`image-size-button ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => handleSizeChange(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </label>
        {selectedSize === "Custom" && (
          <div className="custom-resolution">
            <label>
              Custom Resolution:
              <input
                type="text"
                value={customResolution}
                onChange={handleCustomResolutionChange}
                placeholder="e.g., 800x600"
              />
            </label>
          </div>
        )}
        <label>
          Model:
          <div className="model-buttons">
            {Object.keys(MODELS).map((model) => (
              <button
                key={model}
                className={`model-button ${selectedModel === model ? 'selected' : ''}`}
                onClick={() => onModelChange(model)}
              >
                {model}
              </button>
            ))}
          </div>
        </label>
      </div>
    </div>
  );
}

export default ImageForm;
