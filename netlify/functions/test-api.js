exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            hasApiKey: !!process.env.GROQ_API_KEY,
            apiKeyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
            apiKeyPreview: process.env.GROQ_API_KEY ? 
                process.env.GROQ_API_KEY.substring(0, 10) + '...' : 
                'No key',
            environment: process.env.NODE_ENV || 'production',
            timestamp: new Date().toISOString()
        })
    };
};