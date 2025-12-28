// netlify/functions/chatbot.js
const { Groq } = require('groq-sdk');

exports.handler = async function(event, context) {
    console.log('=== CHATBOT FUNCTION STARTED ===');
    
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
        // Parse request
        let message;
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
        } catch (parseError) {
            console.error('Parse error:', parseError);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid JSON format' })
            };
        }

        // Check for API key
        console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
        console.log('GROQ_API_KEY length:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0);
        
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '') {
            console.error('GROQ_API_KEY is missing or empty');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    reply: "🔧 Quantum AI is undergoing maintenance. Please try again later or contact the QuantumCoders team.",
                    error: "API key not configured"
                })
            };
        }

        // Initialize Groq client
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        console.log('Calling Groq API...');
        
        // Call Groq API with timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are Quantum AI, a helpful assistant created by QuantumCoders (a student tech team). 
                        You specialize in web development, AI, quantum computing, programming, and technology.
                        Keep responses friendly, concise, and informative. 
                        If asked about QuantumCoders, say: "QuantumCoders is an innovative student tech team focused on cutting-edge projects in AI, web development, and quantum computing."
                        Format responses with clear paragraphs.`
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

            clearTimeout(timeout);

            console.log('Groq API response received successfully');
            
            const reply = chatCompletion.choices[0]?.message?.content || 
                         "I received an empty response. Please try again!";

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ reply })
            };

        } catch (apiError) {
            clearTimeout(timeout);
            console.error('Groq API error:', apiError);
            
            let errorMessage = "I'm having trouble connecting to my AI brain. Please try again in a moment! ⚡";
            
            if (apiError.name === 'AbortError') {
                errorMessage = "Request timeout. The AI is taking too long to respond. Please try a simpler question!";
            } else if (apiError.message && apiError.message.includes('401')) {
                errorMessage = "Authentication issue. Please contact the QuantumCoders team to check the API configuration.";
            } else if (apiError.message && apiError.message.includes('429')) {
                errorMessage = "Too many requests! Please wait a moment before trying again.";
            }
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    reply: errorMessage,
                    error: apiError.message || 'Unknown API error'
                })
            };
        }

    } catch (error) {
        console.error('Unexpected error in chatbot:', error);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                reply: "🚀 Quantum AI experienced an unexpected error. The team has been notified!",
                error: error.message || 'Unknown error'
            })
        };
    }
};