require('dotenv').config();
const { HfInference } = require("@huggingface/inference");

const hf = new HfInference(process.env.HF_TOKEN);

const models = [
    "mistralai/Mistral-7B-Instruct-v0.2",
    "mistralai/Mistral-7B-Instruct-v0.3",
    "HuggingFaceH4/zephyr-7b-beta",
    "gpt2"
];

async function test() {
    console.log("Testing Hugging Face connection with LIBRARY and Llama 3.2...");
    const model = "meta-llama/Llama-3.2-3B-Instruct";

    try {
        const response = await hf.chatCompletion({
            model: model,
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 50,
        });

        console.log("Success with library!");
        console.log("Response:", response.choices[0].message.content);
    } catch (error) {
        console.error("Library error:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
        }
    }
}

test();
