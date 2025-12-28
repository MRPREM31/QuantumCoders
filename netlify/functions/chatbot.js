// netlify/functions/chatbot.js
const { Groq } = require('groq-sdk');

exports.handler = async function(event, context) {
    console.log('=== Quantum AI Chatbot Started ===');
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
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
        // Parse message
        const { message } = JSON.parse(event.body || '{}');
        
        if (!message || message.trim() === '') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    reply: "👋 Hello! I'm Quantum AI. What would you like to know?",
                    note: "Empty message received"
                })
            };
        }

        console.log('Processing message:', message.substring(0, 50));
        
        // Get API key
        const apiKey = process.env.GROQ_API_KEY;
        console.log('API Key exists:', !!apiKey);
        
        // DEVELOPMENT MODE - No API key
        if (!apiKey || apiKey.trim() === '' || apiKey === 'test_key_for_local_development') {
            console.log('Running in development mode');
            
            // Smart fallback responses
            const lowerMsg = message.toLowerCase();
            
            if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        reply: "👋 Hello! I'm Quantum AI from QuantumCoders! In development mode - deploy to Netlify for full AI features!",
                        mode: "development"
                    })
                };
            }
            
            if (lowerMsg.includes('quantum') || lowerMsg.includes('coders')) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        reply: "🚀 **QuantumCoders** is an innovative student tech team working on cutting-edge projects in AI, web development, and quantum computing!\n\n*To experience full AI capabilities, deploy with GROQ_API_KEY.*",
                        mode: "development"
                    })
                };
            }
            
            if (lowerMsg.includes('what can you do') || lowerMsg.includes('help')) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        reply: "🤖 **I can help with:**\n• Web Development (HTML/CSS/JS/React)\n• AI & Machine Learning\n• Quantum Computing basics\n• Tech project guidance\n• Coding questions\n\n*Full AI mode available when deployed to Netlify!*",
                        mode: "development"
                    })
                };
            }
            
            if (lowerMsg.includes('who are you')) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        reply: "I'm **Quantum AI**, the intelligent assistant created by QuantumCoders tech team! 🤖\n\n*Running in development mode. For complete AI responses, add GROQ_API_KEY to Netlify.*",
                        mode: "development"
                    })
                };
            }
            
            // Default fallback
            const fallbacks = [
                `💡 You asked: "${message}"\n\nI'm Quantum AI! Currently in development mode. For intelligent responses, deploy with API key.`,
                `🔧 Quantum AI here! Your question: "${message}"\n\n*Development mode active. Contact QuantumCoders team for production setup.*`,
                `⚡ Interesting question! In development, I provide sample responses. Deploy me to unlock full AI power!`,
                `🤖 Thanks for your message! I'm learning. For complete AI assistance, set up GROQ_API_KEY on Netlify.`
            ];
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    reply: fallbacks[Math.floor(Math.random() * fallbacks.length)],
                    mode: "development"
                })
            };
        }

        // PRODUCTION MODE - Has API key
        console.log('Running in production mode with Groq API');
        
        try {
            const groq = new Groq({ apiKey });
            
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are Quantum AI, an enthusiastic and knowledgeable assistant created by QuantumCoders tech team.
                        
                        About QuantumCoders: A student tech team focused on innovative projects in web development, AI, quantum computing, and cutting-edge technology.
                        
                        Your personality:
                        - Friendly, encouraging, and helpful
                        - Passionate about technology and learning
                        - Keep responses concise but informative
                        - Use emojis occasionally for friendliness
                        - Format with clear paragraphs and bullet points when helpful
                        
                        If asked about QuantumCoders, mention: "QuantumCoders is a dynamic student tech team building innovative projects in AI, web development, and quantum computing!"
                        
                        Current context: User is interacting via our website's chat interface.`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                model: "mixtral-8x7b-32768",
                temperature: 0.8,
                max_tokens: 1024,
                stream: false
            });

            const reply = chatCompletion.choices[0]?.message?.content || 
                         "🤔 I received an empty response. Could you please rephrase your question?";

            console.log('Successfully generated AI response');
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    reply,
                    mode: "production",
                    tokens: chatCompletion.usage?.total_tokens || 0
                })
            };

        } catch (apiError) {
            console.error('Groq API error:', apiError);
            
            let errorReply = "🔧 Quantum AI is experiencing technical difficulties. Please try again in a moment!";
            
            if (apiError.message?.includes('401') || apiError.message?.includes('auth')) {
                errorReply = "🔐 Authentication issue detected. Please verify the API key configuration.";
            } else if (apiError.message?.includes('429')) {
                errorReply = "⏳ Too many requests! Please wait a moment before trying again.";
            }
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    reply: errorReply,
                    mode: "production_error",
                    error: apiError.message
                })
            };
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                reply: "🚀 Quantum AI encountered an unexpected error. Our team has been notified!",
                mode: "error",
                error: error.message
            })
        };
    }
};