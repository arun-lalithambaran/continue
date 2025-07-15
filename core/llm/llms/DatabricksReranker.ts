import { Chunk, LLMOptions } from "../../index.js";
import { BaseLLM } from "../index.js";

class DatabricksReranker extends BaseLLM {
  static providerName = "databricksReranker";
  static defaultOptions: Partial<LLMOptions> | undefined = {
    apiBase: "https://dbc-6514b464-70a2.cloud.databricks.com",
    maxEmbeddingBatchSize: 128,
  };

  async rerank(query: string, chunks: Chunk[]): Promise<number[]> {
    if (!query || chunks.length === 0) {
      return [];
    }

    try {
      const url = new URL(`serving-endpoints/${this.model || "reranking_modeltest"}/invocations`, this.apiBase);

      // Create the dataset in the format expected by the model
      const dataset = chunks.map((chunk) => ({
        query: query,
        document: chunk.content,
      }));

      let payload = JSON.stringify({
        dataframe_split: {
          columns: ["query", "document"],
          data: dataset.map(item => [item.query, item.document])
        }
      })
      const resp = await this.fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: payload,
      });

      if (resp.status !== 200) {
        throw new Error(
          `DatabricksReranker API error ${resp.status}: ${await resp.text()}`,
        );
      }

      const data = await resp.json();

      // The response format might need adjustment based on your model's actual output
      // Assuming the model returns an array of relevance scores in the same order as input
      return data.predictions || [];
    } catch (error) {
      console.error("Error in DatabricksReranker:", error);
      // Return default scores (all zeros) in case of error
      return chunks.map(() => 0);
    }
  }
}

export default DatabricksReranker;