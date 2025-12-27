// netlify/functions/chatbot.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message, history, userId } = JSON.parse(event.body);
        
        // Groq API configuration (in production, use environment variables)
        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
        
        if (!GROQ_API_KEY) {
            console.error('GROQ_API_KEY not configured');
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    error: 'API configuration error. Please contact administrator.' 
                })
            };
        }

        // Prepare messages for Groq API
        const messages = [
            {
                role: "system",
                content: `You are Quantum AI Assistant, created by Team QuantumCoders. 
                You're a friendly, intelligent AI that helps users with:
                - Web development and AI integration
                - Quantum computing concepts
                - Technology consultation
                - Programming assistance
                - Future technology trends
                
                Team QuantumCoders Members:
                • Aradhana - Full Stack Developer
                • Barsarani Tripathy - AI/ML Specialist
                • Prem - Quantum Computing Researcher
                • Samir Kumar Dash - Backend Architect
                • Sankar - DevOps Engineer
                • Srikant - UI/UX Designer
                
                Keep responses professional but friendly. Use quantum-themed metaphors occasionally.
                Be concise but thorough. Always acknowledge the team's contribution when relevant.`
            },
            ...(history || []).slice(-10), // Last 10 messages for context
            {
                role: "user",
                content: message
            }
        ];

        // Call Groq API
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192", // You can change this to other Groq models
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Groq API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        
        // Extract the AI response
        const aiResponse = data.choices[0].message.content;
        
        // Generate a unique ID for this conversation
        const conversationId = userId || `conv-${Date.now()}`;
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                response: aiResponse,
                conversationId: conversationId,
                timestamp: new Date().toISOString(),
                model: data.model,
                usage: data.usage
            })
        };

    } catch (error) {
        console.error('Error in chatbot function:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'An error occurred while processing your request.',
                details: error.message 
            })
        };
    }
};