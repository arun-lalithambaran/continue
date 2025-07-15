import { ModelProvider } from "../types.js";

export const DatabricksReranker: ModelProvider = {
  id: "databricksReranker",
  displayName: "Databricks Reranker",
  models: [
    {
      model: "reranking_modeltest",
      displayName: "Databricks Reranking Model",
      contextLength: 4096,
      description: "Self-hosted reranking model on Databricks",
      recommendedFor: ["rerank"],
    },
  ],
  extraParameters: [
    {
      key: "apiBase",
      required: true,
      valueType: "string",
      displayName: "API Base URL",
      description: "The base URL of your Databricks instance (e.g., https://dbc-6514b464-70a2.cloud.databricks.com)",
      defaultValue: "https://dbc-6514b464-70a2.cloud.databricks.com",
    },
  ],
};