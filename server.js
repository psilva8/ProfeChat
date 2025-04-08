const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

// Load environment variables (in local development)
try {
  require('dotenv').config();
} catch (error) {
  console.log('No .env file found, using environment variables');
}

const app = express();
const PORT = process.env.PORT || 3000;

// API Key from environment variables
const API_KEY = process.env.API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// API Endpoint to generate lesson plans
app.post('/api/generate-lesson', async (req, res) => {
  try {
    const { grade, subject, resources } = req.body;
    
    // Validate input
    if (!grade || !subject || !resources) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters: grade, subject, and resources are required' 
      });
    }

    // Check if API key is available
    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'API key is not configured on the server'
      });
    }

    // Construct prompt for the AI
    const prompt = `
    Create a lesson plan for Peruvian teachers teaching ${subject} to grade ${grade} students 
    with access to ${resources}. The lesson plan should include:
    1. A suitable title
    2. A clear learning objective
    3. One focused activity that can be completed with the available resources
    
    Format the response in Spanish, as this is for teachers in Peru.
    `;

    // Call to AI API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an educational assistant for teachers in Peru.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const lessonPlan = response.data.choices[0].message.content;

    // Return the lesson plan
    res.json({
      success: true,
      lesson_plan: lessonPlan
    });
  } catch (error) {
    console.error('Error generating lesson plan:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error generating lesson plan',
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'peru-teacher.html'));
});

// Serve the app directly
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'peru-teacher.html'));
});

// For local development - not used in production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open your browser at http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app; 