// netlify/functions/chatbot.js
const { Groq } = require('groq-sdk');

// netlify/functions/chatbot.js
exports.handler = async function(event, context) {
    console.log('Chatbot function called');
    
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request (preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        let message;
        
        // Parse request
        try {
            const body = JSON.parse(event.body || '{}');
            message = body.message;
            console.log('Received message:', message);
        } catch {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid request format' })
            };
        }

        // Simple response without Groq for testing
        const responses = {
            hello: "Hello! I'm Quantum AI from QuantumCoders! How can I help you today? 🤖",
            hi: "Hi there! Ready to talk tech? 💻",
            who: "I'm Quantum AI, the chatbot assistant for QuantumCoders - a student tech team!",
            help: "I can help with web development, AI projects, coding questions, and tech guidance!",
            default: "Thanks for your message! I'm currently learning to assist with tech questions. Try asking about web development or AI!"
        };

        const lowerMessage = (message || '').toLowerCase();
        let reply = responses.default;

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            reply = responses.hello;
        } else if (lowerMessage.includes('who are you')) {
            reply = responses.who;
        } else if (lowerMessage.includes('help')) {
            reply = responses.help;
        }

        console.log('Sending response:', reply);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply })
        };

    } catch (error) {
        console.error('Error in chatbot function:', error);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                reply: "I'm experiencing some technical difficulties. Please try again in a moment! ⚡"
            })
        };
    }
};