// netlify/functions/test.js
exports.handler = async function() {
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            message: 'Function is working!',
            timestamp: new Date().toISOString()
        })
    };
};