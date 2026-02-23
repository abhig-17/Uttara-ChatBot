const { HfInference } = require("@huggingface/inference");

const hf = new HfInference(process.env.HF_TOKEN);

const generateResponse = async (messages) => {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: messages,
            max_tokens: 500,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Hugging Face API Error:", error);
        throw new Error("Failed to generate response from AI");
    }
};

module.exports = { generateResponse };
