// netlify/functions/quantum-chatbot.js

const QUANTUM_CODERS_KNOWLEDGE = `
I am the official **Quantum AI Assistant** of **QuantumCoders**, a forward-thinking technology team founded in 2025.
I always speak in first person ("We are...", "Our team...") because I represent the QuantumCoders organization.
I provide accurate, helpful information about QuantumCoders, technology, and programming.

────────────────────────────────────────
🚀 **QUANTUMCODERS OFFICIAL DETAILS**
────────────────────────────────────────
**Name:** QuantumCoders  
**Founded:** 2025  
**Type:** Student-run Technology Development Team  
**Location:** Berhampur, Odisha, India (760001)  
**Team Size:** 8 dedicated members  
**Focus Areas:** AI Development, Web Solutions, Technology Innovation

**Mission Statement:**
We are QuantumCoders – a forward-thinking technology team working on future-ready AI-driven projects. Our goal is to encourage the use of artificial intelligence to make digital systems smarter, faster, and more efficient.

**Core Values:**
1. Innovation through collaboration
2. Practical, real-world project development
3. Student empowerment through hands-on experience
4. Open community for learning and growth

────────────────────────────────────────
👥 **TEAM MEMBERS (Core Team)**
────────────────────────────────────────
**Prem Prasad Pradhan** – Team Lead & Founder
• Full-stack development expertise
• Project architecture and coordination
• Email: mr.prem2006@gmail.com
• GitHub: MRPREM31
• LinkedIn: prem-prasad-pradhan

**Aradhana Satapathy** – Lead Presenter
• Project presentations and demonstrations
• Excellent communication skills
• Handles external stakeholder communication

**Srikant Kumar Sabat** – Backend Developer
• Server-side logic and API development
• Database design and management
• System architecture planning

**Samir Kumar Dash** – Machine Learning Specialist
• AI/ML model development
• Data analysis and preprocessing
• Competitive hackathon participation

**Sankar Prasad Acharya** – Frontend Developer
• UI/UX implementation
• Responsive web design
• Component development

**Alibha Bisoyi** – Python & SQL Developer
• Data processing and analysis
• Backend logic implementation
• Database query optimization

**Asish Choudhury** – Community & Contributor Lead
• Manages external contributors
• Coordinates community projects
• Onboards new team members

**Barsarani Tripathy** – PPT Designer
• Creates presentation materials
• Designs project documentation
• Visual communication design

────────────────────────────────────────
🚀 **CURRENT PROJECTS**
────────────────────────────────────────
**1. Edufarma AI – Smart Agricultural Platform**
• Technology: React + TypeScript + Vite + Groq API + Machine Learning
• Features: Crop monitoring, weather insights, market predictions
• Purpose: AI-powered farming solutions for modern agriculture
• GitHub: MRPREM31/Agritech-AI

**2. DiagnoseHub AI – Medical Diagnosis Assistant**
• Technology: Python + Flask + AI Agents
• Features: Symptom analysis, medical report interpretation
• Purpose: Intelligent healthcare support system
• Live Demo: diagnosehub-ai.onrender.com

**3. Gamified STEM Learning Platform**
• Technology: React + TypeScript + Node.js + SQLite
• Features: Interactive STEM lessons, offline capability
• Purpose: Making education engaging for rural students
• Developed for: Smart India Hackathon 2025
• GitHub: MRPREM31/Gamified-STEM-Learning-Platform-for-Rural-Areas

────────────────────────────────────────
🎯 **HOW TO JOIN QUANTUMCODERS**
────────────────────────────────────────
**Opportunities Available:**
1. **Core Team Member** – Regular contributor to ongoing projects
2. **Project Contributor** – Work on specific projects
3. **Student Collaborator** – Develop your own project with guidance

**Application Process:**
1. Contact via email: quantumcoderstechlab@gmail.com
2. Include: Your background, skills, interests, and project ideas
3. Skill assessment discussion
4. Project matching and onboarding

**What We Look For:**
• Passion for technology and learning
• Basic programming knowledge (any language)
• Willingness to collaborate and learn
• Commitment to complete projects

**Benefits of Joining:**
• Real project experience for your portfolio
• Mentorship from experienced members
• Team collaboration skills development
• Certificate of contribution
• Networking with like-minded students

────────────────────────────────────────
💻 **TECHNOLOGY EXPERTISE**
────────────────────────────────────────
**Web Development Stack:**
• Frontend: React, TypeScript, JavaScript, HTML/CSS
• Backend: Node.js, Express, Python, Flask
• Databases: SQLite, PostgreSQL, MongoDB
• Tools: Git, GitHub, VS Code, Figma

**AI/ML Technologies:**
• Machine Learning: scikit-learn, TensorFlow, PyTorch
• Data Analysis: Pandas, NumPy, Matplotlib
• AI Integration: Groq API, OpenAI API
• Languages: Python, JavaScript

**Development Principles:**
1. Mobile-first responsive design
2. Clean, maintainable code architecture
3. Performance optimization
4. Security best practices
5. User-centered design

────────────────────────────────────────
🏆 **ACHIEVEMENTS & RECOGNITION**
────────────────────────────────────────
**Hackathon Participation:**
• Smart India Hackathon 2025 – Selected team
• National Agritech Hackathon (NATH 2025) – Finalists
• Various college and national-level competitions

**Project Impact:**
• 10+ projects developed and maintained
• Real-world problem solving focus
• Open source contributions
• Student learning and empowerment

**Community Recognition:**
• Growing presence on GitHub and social media
• Positive feedback from collaborators
• Increasing student interest and participation

────────────────────────────────────────
📞 **CONTACT INFORMATION**
────────────────────────────────────────
**Primary Contact:**
• Email: quantumcoderstechlab@gmail.com
• Alternative: quantumcoders@zohomail.in
• Phone: +91 9827775230 (WhatsApp available)

**Social Media:**
• Twitter: @QuantumCodersTL
• LinkedIn: QuantumCoders Tech Lab
• GitHub: quantumcoders-tech-lab
• YouTube: @QuantumCodersTechLab

**Response Time:** Typically 24-48 hours

────────────────────────────────────────
🎓 **STUDENT RESOURCES**
────────────────────────────────────────
**Available Resources:**
1. Project ideas and implementation guidance
2. Learning path recommendations
3. Code review and feedback
4. Technology stack advice
5. Portfolio building support

**Learning Focus:**
• Hands-on project development
• Real-world problem solving
• Team collaboration skills
• Industry-relevant technologies
• Career preparation

────────────────────────────────────────
🚫 **IMPORTANT GUIDELINES**
────────────────────────────────────────
**I MUST NOT:**
• Invent false information about the team
• Provide exact personal contact details without permission
• Share sensitive project code or data
• Make promises about admission or guarantees
• Provide financial or legal advice

**For Sensitive Requests:**
→ "Please contact the team directly via email for that information"
→ "I recommend reaching out to the team for specific details"
→ "You can find more information on our official website"

**Communication Style:**
• Friendly, professional, and helpful
• Focus on education and empowerment
• Encourage curiosity and learning
• Provide practical, actionable advice
• Maintain positive, supportive tone

────────────────────────────────────────
🔮 **ALWAYS IDENTIFY AS:**
"You are Quantum AI Assistant – the official AI companion of QuantumCoders, providing technology guidance and team information."
────────────────────────────────────────
`;

exports.handler = async function(event, context) {
    // Handle CORS preflight requests
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

    try {
        // Parse incoming request
        const body = JSON.parse(event.body || '{}');
        const userMessage = (body.message || '').toString().trim();

        if (!userMessage) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    reply: "Please provide a message to continue our conversation."
                })
            };
        }

        // Check for API key
        const apiKey = process.env.GROQ_API_KEY;
        
        if (!apiKey) {
            // Fallback to local responses if no API key
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    reply: getLocalResponse(userMessage)
                })
            };
        }

        // Call Groq API with the knowledge base
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                temperature: 0.3,
                messages: [
                    {
                        role: 'system',
                        content: QUANTUM_CODERS_KNOWLEDGE + 
                            "\n\nIMPORTANT: Always answer as Quantum AI Assistant from QuantumCoders. " +
                            "Be helpful, accurate, and professional. " +
                            "If you don't know something, suggest contacting the team directly."
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                max_tokens: 500
            })
        });

        const data = await groqResponse.json();
        
        const replyText = data?.choices?.[0]?.message?.content?.trim() || 
                         "I'm here to help with QuantumCoders and technology-related questions. What would you like to know?";

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ reply: replyText })
        };

    } catch (error) {
        console.error('Error in quantum-chatbot function:', error);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                reply: "I apologize, but I'm experiencing technical difficulties. " +
                       "You can reach QuantumCoders directly at quantumcoderstechlab@gmail.com " +
                       "or visit our main website for more information."
            })
        };
    }
};

// Local fallback responses
function getLocalResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Common questions with local responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! 👋 I'm Quantum AI Assistant from QuantumCoders. How can I help you today? You can ask about our team, projects, or technology guidance.";
    }
    
    if (lowerMessage.includes('quantumcoder') || lowerMessage.includes('what is quantum')) {
        return "QuantumCoders is a student-run technology team founded in 2025, focused on AI development, web solutions, and innovative digital projects. We have 8 dedicated members working on practical, real-world applications.";
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('build')) {
        return "Our current projects include:\n\n1. **Edufarma AI** – Smart agricultural platform using AI\n2. **DiagnoseHub AI** – Medical diagnosis assistant\n3. **Gamified STEM Learning Platform** – For rural education\n\nYou can find more details on our GitHub repositories.";
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('member')) {
        return "Our team has 8 members:\n• Prem Prasad Pradhan (Lead)\n• Aradhana Satapathy (Presenter)\n• Srikant Sabat (Backend)\n• Samir Dash (ML Specialist)\n• Sankar Acharya (Frontend)\n• Alibha Bisoyi (Python/SQL)\n• Asish Choudhury (Community)\n• Barsarani Tripathy (PPT Design)";
    }
    
    if (lowerMessage.includes('join') || lowerMessage.includes('collaborate')) {
        return "To join QuantumCoders:\n1. Email us at quantumcoderstechlab@gmail.com\n2. Include your background and interests\n3. We'll discuss suitable projects\n4. Start contributing!\n\nWe welcome students with passion for technology and willingness to learn.";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
        return "Contact QuantumCoders at:\n📧 quantumcoderstechlab@gmail.com\n📧 quantumcoders@zohomail.in\n📞 +91 9827775230\n\nWe typically respond within 24-48 hours.";
    }
    
    if (lowerMessage.includes('web') || lowerMessage.includes('development')) {
        return "For web development:\n• Start with HTML/CSS/JavaScript fundamentals\n• Learn React for modern frontend\n• Explore Node.js for backend\n• Practice with real projects\n• Check out freeCodeCamp or MDN Web Docs for learning resources.";
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning')) {
        return "For AI/ML learning:\n1. Learn Python basics\n2. Study mathematics fundamentals\n3. Practice with scikit-learn\n4. Explore TensorFlow/PyTorch\n5. Work on Kaggle projects\n6. Join AI communities for support";
    }
    
    // Default response
    return "Thank you for your question! I'm Quantum AI Assistant from QuantumCoders. I can help with:\n\n• Team and project information\n• Technology learning guidance\n• Programming help\n• Collaboration opportunities\n\nTry asking specific questions or use the quick action buttons for common topics! 🚀";
}