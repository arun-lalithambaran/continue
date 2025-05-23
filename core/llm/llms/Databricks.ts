import { ChatMessage, CompletionOptions, LLMOptions } from "../../index.js";
import { BaseLLM } from "../index.js";
import { streamDataBricksJSON, streamDataBricksSse } from "../stream.js";


class DataBricks extends BaseLLM {

    static providerName = "databricks";
    stream = true;

    static defaultOptions: Partial<LLMOptions> = {
        apiBase: "",
        apiKey: ""
    };

    private _convertArgs(options: CompletionOptions) {
        const finalOptions = {
            max_tokens: 128000,
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
    protected async *_streamChat(
        messages: ChatMessage[],
        signal: AbortSignal,
        options: CompletionOptions,
    ): AsyncGenerator<ChatMessage> {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            ...this.requestOptions?.headers,
        };
// https://dbc-6514b464-70a2.cloud.databricks.com/serving-endpoints/databricks-claude-3-7-sonnet/invocations
        const resp = await this.fetch(new URL("serving-endpoints/databricks-claude-3-7-sonnet/invocations", this.apiBase), {
            method: "POST",
            headers,
            body: JSON.stringify({
                messages: messages.map(m => ({ role: m.role, content: m.content })), // Basic conversion, might need more sophisticated handling for different content types
                stream: this.stream,
                ...this._convertArgs(options),
            }),
            signal,
        });
        if (this.stream) {
            for await (const value of streamDataBricksSse(resp)) {
                if (value.content) {
                    yield { role: "assistant", content: value.content };
                }
            }
        } else {
            for await (const value of streamDataBricksJSON(resp)) {
                // Assuming streamDataBricksJSON yields objects like { role: "assistant", content: "..." }
                // or at least { content: "..." } which we'd wrap.
                // If value is already a ChatMessage:
                // yield value;
                // If value is { content: "..." }:
                if (value.content) {
                    yield { role: "assistant", content: value.content };
                }
            }
        }
    }
}

export default DataBricks;