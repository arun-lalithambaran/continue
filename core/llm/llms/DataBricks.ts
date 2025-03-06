import { CompletionOptions, LLMOptions } from "../../index.js";
import { BaseLLM } from "../index.js";
import { streamDataBricksJSON, streamDataBricksSse } from "../stream.js";


class DataBricks extends BaseLLM {

    static providerName = "databricks_api";
    stream = true;

    static defaultOptions: Partial<LLMOptions> = {
        apiBase: "https://dbc-088fc0f5-68f1.cloud.databricks.com/",
    };

    private _convertArgs(options: CompletionOptions, prompt: string) {
        const finalOptions = {
            max_tokens: 512,
            frequency_penalty: options.frequencyPenalty,
            presence_penalty: options.presencePenalty,
            min_p: options.minP,
            mirostat: options.mirostat,
            stop: options.stop,
            top_k: options.topK,
            top_p: 0.9,
            temperature: 0.7
        };

        return finalOptions;
    }
    protected async *_streamComplete(
        prompt: string,
        signal: AbortSignal,
        options: CompletionOptions,
    ): AsyncGenerator<string> {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            ...this.requestOptions?.headers,
        };

        const resp = await this.fetch(new URL("serving-endpoints/databricks-meta-llama-3-3-70b-instruct/invocations", this.apiBase), {
            method: "POST",
            headers,
            body: JSON.stringify({
                messages: [
                    { "role": "user", "content": prompt }
                ],
                stream: this.stream,
                ...this._convertArgs(options, prompt),
            }),
            signal,
        });
        if (this.stream) {
            for await (const value of streamDataBricksSse(resp)) {
                if (value.content) {
                    yield value.content;
                }
            }
        } else {
            for await (const value of streamDataBricksJSON(resp)) {
                if (value.content) {
                    yield value.content;
                }
            }
        }
    }
}

export default DataBricks;