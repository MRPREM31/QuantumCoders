// netlify/functions/chatbot.js
const { Groq } = require('groq-sdk');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message } = JSON.parse(event.body);
        
        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Initialize Groq client with your API key from environment variables
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        // Create chat completion
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are Quantum AI, a helpful assistant from QuantumCoders. You specialize in coding, technology, web development, AI, and quantum computing. Keep responses concise, helpful, and engaging. Use emojis occasionally to make it friendly."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 500,
            stream: false
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reply: chatCompletion.choices[0]?.message?.content || "I couldn't generate a response."
            })
        };

    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to process request',
                details: error.message 
            })
        };
    }
};