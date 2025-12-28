// netlify/functions/chatbot.js
const { Groq } = require('groq-sdk');

exports.handler = async function(event, context) {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message } = JSON.parse(event.body || '{}');
        
        if (!message || message.trim() === '') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }

        // Check if API key is available
        if (!process.env.GROQ_API_KEY) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    reply: "Quantum AI: My API key is not configured. Please contact the administrator to set up GROQ_API_KEY environment variable.",
                    error: "GROQ_API_KEY not found"
                })
            };
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are Quantum AI, a helpful assistant for QuantumCoders - a student tech team specializing in web development, AI, quantum computing, and technology. Keep responses concise, friendly, and informative.`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 1024
        });

        const reply = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply })
        };

    } catch (error) {
        console.error('Chatbot error:', error);
        
        let fallbackReply = "I'm experiencing technical difficulties. Please try again! ⚡";
        
        if (error.message.includes('API key') || error.message.includes('authentication')) {
            fallbackReply = "API key issue detected. Please ensure GROQ_API_KEY is set in environment variables.";
        } else if (error.message.includes('timeout') || error.message.includes('network')) {
            fallbackReply = "Network connection issue. Please try again.";
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                reply: fallbackReply,
                error: error.message
            })
        };
    }
};