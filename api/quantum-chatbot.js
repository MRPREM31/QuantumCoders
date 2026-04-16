// api/quantum-chatbot.js - Updated with complete knowledge base
import {
  AI_IDENTITY,
  RESPONSE_RULES,
  CORE_FACTS,
  QUANTUMCODERS_EXPLANATION,
  TEAM_INFO,
  PROJECT_INFO,
  ACHIEVEMENTS_INFO,
  JOIN_INFO,
  WEBSITE_INFO,
  LEARNING_INFO,
  CONTACT_INFO,
  HACKATHON_INFO,
  TECHNOLOGY_INFO,
  QCDS_COMPLETE_INFO,
  QCDS_SERVICES
} from '../ai-knowledge.js';

function buildSystemPrompt(message) {
  const msg = message.toLowerCase();
  let prompt = AI_IDENTITY + CORE_FACTS;
  
  // Always start with core explanation for identity questions
  if (msg.includes("what is") || msg.includes("about quantumcoders") || 
      msg.includes("who are you") || msg.includes("introduce") ||
      msg.includes("tell me about")) {
    prompt += QUANTUMCODERS_EXPLANATION;
  }
  
  // QCDS (Data Solutions) specific queries - HIGHEST PRIORITY
  if (msg.includes("data solution") || msg.includes("qcds") || 
      msg.includes("transcription") || msg.includes("annotation") ||
      msg.includes("voice over") || msg.includes("segmentation") ||
      msg.includes("data collection") || msg.includes("audio") ||
      msg.includes("dataset") || msg.includes("desicrew") ||
      msg.includes("data services") || msg.includes("ai dataset") ||
      msg.includes("language data") || msg.includes("professional data") ||
      msg.includes("data vendor") || msg.includes("enterprise data")) {
    prompt += QCDS_COMPLETE_INFO + QCDS_SERVICES;
  }
  
  // Team queries (General QCTL team)
  if (msg.includes("team") || msg.includes("member") || 
      msg.includes("prem") || msg.includes("founder") ||
      msg.includes("aradhana") || msg.includes("srikant") ||
      msg.includes("samir") || msg.includes("sankar") ||
      msg.includes("alibha") || msg.includes("asish") ||
      msg.includes("barsarani") || msg.includes("sandeep") ||
      msg.includes("sandip") || msg.includes("social media") ||
      msg.includes("lead") || msg.includes("developer") ||
      msg.includes("designer") || msg.includes("who is") || 
      msg.includes("members") || msg.includes("specialist") ||
      msg.includes("chandan") || msg.includes("madhushmita") ||
      msg.includes("subhasish")) {
    prompt += TEAM_INFO;
  }
  
  // Project queries
  if (msg.includes("project") || msg.includes("build") || 
      msg.includes("app") || msg.includes("working on") ||
      msg.includes("edufarma") || msg.includes("diagnosehub") ||
      msg.includes("stem") || msg.includes("platform") ||
      msg.includes("ai ") || msg.includes("application") ||
      msg.includes("what projects") || msg.includes("current work")) {
    prompt += PROJECT_INFO;
  }
  
  // Achievement queries
  if (msg.includes("achievement") || msg.includes("accomplish") ||
      msg.includes("milestone") || msg.includes("success") ||
      msg.includes("win") || msg.includes("finalist") ||
      msg.includes("progress") || msg.includes("recognition") ||
      msg.includes("what have you done")) {
    prompt += ACHIEVEMENTS_INFO;
  }
  
  // Join queries
  if (msg.includes("join") || msg.includes("apply") || 
      msg.includes("participate") || msg.includes("become member") ||
      msg.includes("how to contribute") || msg.includes("membership") ||
      msg.includes("recruitment") || msg.includes("how can i join") ||
      msg.includes("become part") || msg.includes("get involved")) {
    prompt += JOIN_INFO;
  }
  
  // Website queries
  if (msg.includes("website") || msg.includes("page") || 
      msg.includes("url") || msg.includes("link") ||
      msg.includes("section") || msg.includes("feature") ||
      msg.includes("site") || msg.includes("web") ||
      msg.includes("quantumcoders.vercel.app")) {
    prompt += WEBSITE_INFO;
  }
  
  // Learning queries
  if (msg.includes("learn") || msg.includes("study") || 
      msg.includes("resource") || msg.includes("tutorial") ||
      msg.includes("guide") || msg.includes("course") ||
      msg.includes("how to code") || msg.includes("beginner") ||
      msg.includes("tutorial") || msg.includes("roadmap") ||
      msg.includes("learning path") || msg.includes("study material")) {
    prompt += LEARNING_INFO;
  }
  
  // Contact queries
  if (msg.includes("contact") || msg.includes("email") || 
      msg.includes("phone") || msg.includes("whatsapp") ||
      msg.includes("reach") || msg.includes("get in touch") ||
      msg.includes("connect") || msg.includes("how to contact") ||
      msg.includes("address") || msg.includes("location")) {
    prompt += CONTACT_INFO;
  }
  
  // Hackathon queries
  if (msg.includes("hackathon") || msg.includes("competition") ||
      msg.includes("si h") || msg.includes("nath") ||
      msg.includes("coding competition") || msg.includes("event") ||
      msg.includes("participated in") || msg.includes("hackathon experience")) {
    prompt += HACKATHON_INFO;
  }
  
  // Technology queries
  if (msg.includes("tech") || msg.includes("stack") || 
      msg.includes("technology") || msg.includes("framework") ||
      msg.includes("language") || msg.includes("programming") ||
      msg.includes("code") || msg.includes("develop") ||
      msg.includes("tools") || msg.includes("software") ||
      msg.includes("library") || msg.includes("api") ||
      msg.includes("what tech") || msg.includes("programming language")) {
    prompt += TECHNOLOGY_INFO;
  }
  
  // Add response rules LAST
  prompt += RESPONSE_RULES;
  
  return prompt;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      reply: "⚠️ Method Not Allowed. Please use POST request." 
    });
  }

  const { message = "" } = req.body || {};
  
  if (!message.trim()) {
    return res.status(400).json({
      reply: "Hello! I'm Quantum AI Assistant. How can I help you with QuantumCoders today?"
    });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      reply: "⚠️ Server configuration issue. Please contact quantumcoderstechlab@gmail.com directly."
    });
  }

  try {
    const systemPrompt = buildSystemPrompt(message);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          max_tokens: 350, // Increased slightly for better answers
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message
            }
          ]
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Production log
    console.log("QuantumChatbot API:", {
      model: "llama-3.1-8b-instant",
      question: message.substring(0, 100),
      tokens: data?.usage,
      timestamp: new Date().toISOString()
    });

    if (!data?.choices?.[0]?.message?.content) {
      return res.json({
        reply: "⚠️ Quantum AI is temporarily unavailable. Please contact us directly at quantumcoderstechlab@gmail.com"
      });
    }

    const reply = data.choices[0].message.content.trim();
    
    if (!reply) {
      return res.json({
        reply: "I'm not sure how to answer that. Could you please rephrase or contact us at quantumcoderstechlab@gmail.com?"
      });
    }

    res.json({ reply });

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        reply: "⚠️ Request timeout. Please try again or contact us directly at quantumcoderstechlab@gmail.com"
      });
    }
    
    console.error("QuantumChatbot API error:", err.message);
    
    // Enhanced fallback responses based on question type
    const msg = message.toLowerCase();
    
    if (msg.includes("data solution") || msg.includes("qcds") || 
        msg.includes("transcription") || msg.includes("annotation") ||
        msg.includes("voice over") || msg.includes("data collection")) {
      return res.json({
        reply: "QuantumCoders Data Solutions (QCDS) is our professional language data and AI dataset services team. We offer: Audio Transcription, Data Annotation, Voice Over, Audio Segmentation, and AI Data Collection. We work with DesiCrew Solutions for 1.5+ years and have 30+ specialists. Languages supported: Hindi, English, Odia, Bengali. Contact: quantumcoderstechlab@gmail.com or +91 9827775230"
      });
    }
    
    if (msg.includes("what is") || msg.includes("quantumcoders") || msg.includes("who are you")) {
      return res.json({
        reply: "We are QuantumCoders Tech Lab, a student-driven AI and web development community founded in 2025. We also operate QuantumCoders Data Solutions for professional language data services. We focus on hands-on learning, real-world projects, and hackathon innovation. Visit https://quantumcoders.vercel.app"
      });
    }
    
    if (msg.includes("team") || msg.includes("founder") || msg.includes("member")) {
      return res.json({
        reply: "Our QCTL team has 9 core members led by Prem Prasad Pradhan (Founder). QCDS team has 30+ specialists. QCTL members: Aradhana (Presenter), Srikant (Backend), Samir (AI), Sankar (Frontend), Alibha (Python), Asish (Community), Barsarani (Design), Sandip (Social Media). Email: quantumcoderstechlab@gmail.com"
      });
    }
    
    if (msg.includes("project") || msg.includes("work on") || msg.includes("build")) {
      return res.json({
        reply: "QCTL Projects: 1) Edufarma AI (agriculture platform), 2) DiagnoseHub AI (medical diagnosis), 3) Gamified STEM Learning Platform. QCDS Projects: Professional data services with 1.5+ years experience with DesiCrew. Check projects at quantumcoders.vercel.app"
      });
    }
    
    if (msg.includes("achievement") || msg.includes("hackathon") || msg.includes("accomplish")) {
      return res.json({
        reply: "QCTL: Participated in SIH 2025, national hackathons, finalists in NATH 2025. Built 10+ projects, mentored 9+ students, growing community. QCDS: 1.5+ years proven partnership, 30+ specialists, multiple enterprise projects. Visit Achievements: quantumcoders.vercel.app/certificates.html"
      });
    }
    
    if (msg.includes("join") || msg.includes("apply") || msg.includes("participate")) {
      return res.json({
        reply: "Join QuantumCoders Tech Lab! Email quantumcoderstechlab@gmail.com with your background/interests. No fees, 3-5 hours/week, beginner-friendly. Mentorship, real projects, certificates. For QCDS projects/collaboration, contact the same email."
      });
    }
    
    if (msg.includes("learn") || msg.includes("study") || msg.includes("resource")) {
      return res.json({
        reply: "Recommended: freeCodeCamp for web dev, Kaggle for AI/ML, Fast.ai for deep learning. We provide 90-day learning plans, project guidance, code reviews, and tech advice. Contact: quantumcoderstechlab@gmail.com"
      });
    }
    
    if (msg.includes("contact") || msg.includes("email") || msg.includes("phone")) {
      return res.json({
        reply: "Contact QuantumCoders: Email: quantumcoderstechlab@gmail.com | Phone: +91 9827775230 (WhatsApp) | Twitter: @QuantumCodersTL | LinkedIn: QuantumCoders Tech Lab | Location: Berhampur, Odisha, India"
      });
    }
    
    if (msg.includes("tech") || msg.includes("stack") || msg.includes("framework")) {
      return res.json({
        reply: "QCTL Tech: React/TypeScript, Node.js/Python, PostgreSQL/SQLite, TensorFlow/PyTorch, Groq API, VS Code, GitHub, Vercel/Render. QCDS Tech: Audio processing, annotation platforms, data management systems. Clean code, best practices followed."
      });
    }
    
    if (msg.includes("website") || msg.includes("url") || msg.includes("site")) {
      return res.json({
        reply: "Main website: https://quantumcoders.vercel.app | QCDS page: /quantumcoders-data-solutions.html | Features: 7 main sections, AI chatbot, theme toggle, responsive design, resource pages. Check certificates, projects, and team members."
      });
    }
    
    // Generic fallback
    return res.status(500).json({
      reply: "I'm having trouble processing your request. Could you please rephrase or contact us directly at quantumcoderstechlab@gmail.com? We can help with: Tech Lab projects, Data Solutions services, team info, or joining."
    });
  }
}