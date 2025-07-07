import { MediaType, ModelProvider } from "../types.js";

export const Databricks: ModelProvider = {
  id: "databricks",
  displayName: "Databricks",
  models: [
    {
      model: "databricks-claude-sonnet-4",
      displayName: "Databricks Claude 4 Sonnet",
      contextLength: 200000,
      maxCompletionTokens: 8192,
      description: "Claude 4 Sonnet model on Databricks",
      regex: /databricks-claude-(?:4-sonnet|sonnet-4).*/i,
      recommendedFor: ["chat"],
      // Adding tools capability and image support
      mediaTypes: [MediaType.Text, MediaType.Image],
      // The model inherits Claude 4's capabilities including tools support
    },
    {
      model: "databricks-claude-3-7-sonnet",
      displayName: "Databricks Claude 3.7 Sonnet",
      contextLength: 200000,
      maxCompletionTokens: 8192,
      description: "Claude 3.7 Sonnet model on Databricks",
      regex: /databricks-claude-3[.-]7-sonnet.*/i,
      recommendedFor: ["chat"],
      // Adding tools capability and image support
      mediaTypes: [MediaType.Text, MediaType.Image],
      // The model inherits Claude 3.7's capabilities including tools support
    },
    {
      model: "databricks-llama-4-maverick",
      displayName: "Databricks LLAMA 4 Maverick",
      contextLength: 16000,
      maxCompletionTokens: 4096,
      description: "LLAMA 4 Maverick model on Databricks",
      regex: /databricks-llama-4-maverick.*/i,
      recommendedFor: ["chat"],
      // Adding tools capability and image support
      mediaTypes: [MediaType.Text, MediaType.Image],
      // The model inherits LLAMA 4's capabilities including tools support
    }
  ],
};