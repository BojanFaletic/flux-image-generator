import React from "react";
import { configureFal } from "../api";

function ApiKeyManager({ apiKey, setApiKey }) {
  const handleApiKeyChange = (event) => {
    const newApiKey = event.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("apiKey", newApiKey);
    console.log("API Key set to:", newApiKey);
    configureFal(newApiKey);
  };

  return (
    <div className="api-key-manager">
      <label>
        API Key:
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your API key here..."
        />
      </label>
    </div>
  );
}

export default ApiKeyManager;
