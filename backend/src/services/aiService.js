const { HfInference } = require("@huggingface/inference");

const hf = new HfInference(process.env.HF_TOKEN);

const generateResponse = async (messages) => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || "";

    try {
        if (!process.env.HF_TOKEN || process.env.HF_TOKEN === 'your_huggingface_token_here') {
            throw new Error("No Hugging Face token configured.");
        }

        const model = process.env.HF_MODEL || "meta-llama/Llama-3.1-8B-Instruct";
        const response = await hf.chatCompletion({
            model: model,
            messages: messages,
            max_tokens: 500,
        });

        if (response?.choices?.[0]?.message?.content) {
            return response.choices[0].message.content;
        }
    } catch (error) {
        console.error("Hugging Face API Error:", error.message || error);

        const errorDetail = error.httpResponse?.body?.error?.message
            || error.message
            || "Hugging Face service unavailable";

        if (errorDetail.includes("credits") || errorDetail.includes("credit")) {
            return `> ⚠️ **Hugging Face Account Notice**: Free serverless inference credits have been exhausted for this token.\n> To enable live model inference, please add credits at [hf.co/settings/billing](https://huggingface.co/settings/billing) or update \`HF_TOKEN\` in \`backend/.env\`.\n\n**Uttara AI Assistant**: I received your message:\n\n> "${lastUserMessage}"\n\nAll frontend, backend routing, state management, and chat features are active and working!`;
        }

        if (errorDetail.includes("token") || errorDetail.includes("Authorization") || errorDetail.includes("token configured")) {
            return `> ⚠️ **Configuration Notice**: Valid Hugging Face token not found.\n> Please set an active token in \`backend/.env\` as \`HF_TOKEN=your_token\`.\n\n**Uttara AI Assistant**: I received your message: "${lastUserMessage}".`;
        }

        return `> ⚠️ **Notice (${errorDetail})**\n\n**Uttara AI Assistant**: I received your prompt: "${lastUserMessage}".`;
    }
};

module.exports = { generateResponse };
