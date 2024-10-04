import * as fal from "@fal-ai/serverless-client";

export function configureFal(apiKey) {
  fal.config({
    credentials: apiKey,
  });
}

export async function submitInferenceRequest(
  prompt,
  imageSize,
  numImages,
  guidanceScale,
  safetyTolerance,
  numInferenceSteps,
  enableSafetyChecker,
  seed,
  selectedModel
) {
  try {
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      throw new Error("Invalid prompt");
    }
    if (
      !imageSize ||
      !imageSize.width ||
      !imageSize.height ||
      typeof imageSize.width !== "number" ||
      typeof imageSize.height !== "number"
    ) {
      throw new Error("Invalid image size");
    }
    if (!Number.isInteger(numImages) || numImages < 1) {
      throw new Error("Invalid number of images");
    }
    if (typeof guidanceScale !== "number" || guidanceScale < 0) {
      throw new Error("Invalid guidance scale");
    }
    if (
      typeof safetyTolerance !== "number" ||
      safetyTolerance < 0 ||
      safetyTolerance > 10
    ) {
      throw new Error("Invalid safety tolerance");
    }
    if (!Number.isInteger(numInferenceSteps) || numInferenceSteps < 1) {
      throw new Error("Invalid number of inference steps");
    }
    if (typeof enableSafetyChecker !== "boolean") {
      throw new Error("Invalid enable safety checker value");
    }
    if (seed !== null && (!Number.isInteger(seed) || seed < 0)) {
      throw new Error("Invalid seed");
    }

    const input = {
      seed: seed,
      prompt: prompt,
      image_size: {
        width: imageSize.width,
        height: imageSize.height,
      },
      num_images: numImages,
      guidance_scale: guidanceScale,
      safety_tolerance: safetyTolerance,
      num_inference_steps: numInferenceSteps,
      enable_safety_checker: enableSafetyChecker,
    };
    console.log("Submitting inference request with input:", input);

    const result = await fal.subscribe(selectedModel, {
      input: input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("Inference request completed successfully.");
    return result;

  } catch (error) {
    console.error("Error submitting inference request:", error);
    if (error.response && error.response.data) {
      console.error("API error details:", error.response.data);
    }
    throw new Error(`Failed to submit inference request: ${error.message}`);
  }
}

export async function checkInferenceStatus(requestId) {
  // This function is no longer needed as we're using fal.subscribe
  console.warn("checkInferenceStatus is deprecated when using fal.subscribe");
  return { status: "DEPRECATED" };
}
