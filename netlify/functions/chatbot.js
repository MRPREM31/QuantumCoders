// netlify/functions/chatbot.js
const { Groq } = require('groq-sdk');

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
            
            if (!message || message.trim() === '') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Message is required' })
                };
            }
        } catch {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid request format' })
            };
        }

        // Initialize Groq client with your API key
        // IMPORTANT: Add your Groq API key to Netlify environment variables
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are Quantum AI, a helpful assistant for QuantumCoders - a student tech team. 
                    You specialize in web development, AI, quantum computing, and technology.
                    Keep responses concise, friendly, and informative.`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "mixtral-8x7b-32768", // You can also use "llama2-70b-4096" or "gemma-7b-it"
            temperature: 0.7,
            max_tokens: 1024,
            stream: false
        });

        const reply = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
        
        console.log('Groq API response received');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply })
        };

    } catch (error) {
        console.error('Error in chatbot function:', error);
        
        // Provide fallback responses based on error type
        let fallbackReply = "I'm experiencing some technical difficulties. Please try again in a moment! ⚡";
        
        if (error.message.includes('API key')) {
            fallbackReply = "API configuration issue. Please contact the QuantumCoders team.";
        } else if (error.message.includes('timeout') || error.message.includes('network')) {
            fallbackReply = "Network connection issue. Please check your internet and try again.";
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