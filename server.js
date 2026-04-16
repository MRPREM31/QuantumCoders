const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Forward API requests to the handler
app.post('/api/quantum-chatbot', async (req, res) => {
  try {
    // Handle API request
    const message = req.body.message || '';
    
    // If you want to use the actual handler, import it here
    // For now, send a simple response to test
    res.json({
      reply: "Hello! I'm Quantum AI Assistant. Ask me about QuantumCoders, our team, projects, or data solutions!"
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ reply: 'Error processing request. Please try again.' });
  }
});

// Fallback route for any other requests
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`📱 Open: http://localhost:${PORT}/chatbot.html\n`);
});