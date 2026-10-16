const { generateResponse } = require('../services/aiService');

const sendMessage = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) return res.status(400).json({ error: 'Message is required' });

        // messages for AI
        const apiMessages = Array.isArray(history) && history.length > 0
            ? history.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
            }))
            : [{ role: 'user', content: message }];

        // Generate AI response
        const aiResponse = await generateResponse(apiMessages);

        res.json({
            response: aiResponse
        });
    } catch (error) {
        console.error('Chat controller error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
};

module.exports = {
    sendMessage
};
