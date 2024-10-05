import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import ImageForm from "./components/ImageForm";
import ImageDisplay from "./components/ImageDisplay";
import ImageHistory from "./components/ImageHistory";
import ApiKeyManager from "./components/ApiKeyManager";
import { configureFal } from "../api/fal_ai";
import { MODELS } from "./constants";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [generationResult, setGenerationResult] = useState(null);
  const [status, setStatus] = useState("idle");

  const [imageHistory, setImageHistory] = useState(() => {
    const storedHistory = JSON.parse(
      localStorage.getItem("imageHistory") || "[]"
    );
    return storedHistory;
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  const first_model_name = Object.keys(MODELS)[0];
  const [selectedModel, setSelectedModel] = useState(first_model_name);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("apiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
      configureFal(storedApiKey);
    } else {
      setStatus("noApiKey");
      setShowApiKeyManager(true);
    }
  }, []);

  const handleSubmit = (result) => {
    setGenerationResult(result);
    setStatus("generated");
    setSelectedImage(null);
    console.log("Generation result:", result);

    if (result && result.output.images && result.output.images.length > 0) {
      setImageHistory((prevHistory) => {
        const updatedHistory = [result, ...prevHistory]
          // remove duplicates
          .filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) => t.output.images[0].url === item.output.images[0].url
              )
          );

        localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }
  };

  const handleGenerationStart = () => {
    setStatus("generating");
  };

  const handleSelectHistoryImage = (image) => {
    setSelectedImage(image);
  };

  const handleDeleteImage = (imageToDelete) => {
    setImageHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter(
        (item) => item.images[0].url !== imageToDelete.images[0].url
      );
      localStorage.setItem("imageHistory", JSON.stringify(updatedHistory));
      return updatedHistory;
    });
    if (
      selectedImage &&
      selectedImage.images[0].url === imageToDelete.images[0].url
    ) {
      setSelectedImage(null);
    }
  };

  const toggleApiKeyManager = () => {
    setShowApiKeyManager(!showApiKeyManager);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h2> FLUX 1.x [pro] </h2>
        <p>
          <button onClick={toggleApiKeyManager} className="api-key-toggle">
            {showApiKeyManager ? "Hide API Key" : "Show API Key"}
          </button>
        </p>
      </div>
      {showApiKeyManager && (
        <ApiKeyManager apiKey={apiKey} setApiKey={setApiKey} />
      )}
      <main className="app-main container">
        <div className="controls">
          <ImageForm
            onSubmit={handleSubmit}
            apiKey={apiKey}
            onGenerationStart={handleGenerationStart}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
        <div className="result">
          <ImageDisplay
            generationResult={generationResult}
            status={status}
            selectedImage={selectedImage}
            onDeleteImage={handleDeleteImage}
          />
        </div>
      </main>
      <div className="history">
        <ImageHistory
          onSelectImage={handleSelectHistoryImage}
          imageHistory={imageHistory}
        />
      </div>
    </div>
  );
}

export default App;
