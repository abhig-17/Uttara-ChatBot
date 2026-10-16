require('dotenv').config();
const { generateResponse } = require('./src/services/aiService');

async function testService() {
    console.log("Testing actual aiService.js...");
    try {
        const response = await generateResponse([{ role: "user", content: "Hello, how are you?" }]);
        console.log("Success!");
        console.log("AI Response:", response);
    } catch (error) {
        console.error("Service test failed!");
        console.error(error);
    }
}

testService();
