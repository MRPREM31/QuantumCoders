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
  TECHNOLOGY_INFO
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
  
  // Team queries
  if (msg.includes("team") || msg.includes("member") || 
      msg.includes("prem") || msg.includes("founder") ||
      msg.includes("aradhana") || msg.includes("srikant") ||
      msg.includes("samir") || msg.includes("sankar") ||
      msg.includes("alibha") || msg.includes("asish") ||
      msg.includes("barsarani") || msg.includes("lead") ||
      msg.includes("developer") || msg.includes("designer") ||
      msg.includes("who is") || msg.includes("members")) {
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
    
    if (msg.includes("what is") || msg.includes("quantumcoders") || msg.includes("who are you")) {
      return res.json({
        reply: "We are QuantumCoders Tech Lab, a student-driven AI and web development community founded in 2025. We focus on hands-on learning, real-world projects, and hackathon innovation. Visit https://quantumcoders.vercel.app"
      });
    }
    
    if (msg.includes("team") || msg.includes("founder") || msg.includes("member")) {
      return res.json({
        reply: "We have 8 core team members led by Prem Prasad Pradhan (Founder & Team Lead). Other members include Aradhana (Presenter), Srikant (Backend), Samir (AI), Sankar (Frontend), Alibha (Python), Asish (Community), and Barsarani (Design). Email quantumcoderstechlab@gmail.com for details."
      });
    }
    
    if (msg.includes("project") || msg.includes("work on") || msg.includes("build")) {
      return res.json({
        reply: "Our main projects are: 1) Edufarma AI (agriculture platform), 2) DiagnoseHub AI (medical diagnosis), and 3) Gamified STEM Learning Platform. All use modern tech stacks and are actively developed. Check Projects section at quantumcoders.vercel.app"
      });
    }
    
    if (msg.includes("achievement") || msg.includes("hackathon") || msg.includes("accomplish")) {
      return res.json({
        reply: "We've participated in SIH 2025, national hackathons, and were finalists in NATH 2025. Built 10+ projects, mentored 8+ students, and have a growing community. Visit Achievements section on our website."
      });
    }
    
    if (msg.includes("join") || msg.includes("apply") || msg.includes("participate")) {
      return res.json({
        reply: "Anyone can join QuantumCoders! Email quantumcoderstechlab@gmail.com with your background/interests. No fees, 3-5 hours/week commitment, beginner-friendly. We provide mentorship, real projects, and certificates."
      });
    }
    
    if (msg.includes("learn") || msg.includes("study") || msg.includes("resource")) {
      return res.json({
        reply: "We recommend freeCodeCamp for web dev, Kaggle for AI/ML, and our 90-day learning plan. We provide project guidance, code reviews, and tech advice. Contact us for personalized learning paths."
      });
    }
    
    if (msg.includes("contact") || msg.includes("email") || msg.includes("phone")) {
      return res.json({
        reply: "Contact us at quantumcoderstechlab@gmail.com (primary) or +91 9827775230 (WhatsApp). Also on Twitter @QuantumCodersTL, LinkedIn, and GitHub. Response times: 4-48 hours depending on query."
      });
    }
    
    if (msg.includes("tech") || msg.includes("stack") || msg.includes("framework")) {
      return res.json({
        reply: "For web dev: React/TypeScript, Node.js/Python, PostgreSQL/SQLite. For AI: Python with TensorFlow/PyTorch, Groq API. Tools: VS Code, GitHub, Figma, Vercel/Render. We follow clean code and best practices."
      });
    }
    
    if (msg.includes("website") || msg.includes("url") || msg.includes("site")) {
      return res.json({
        reply: "Our website is https://quantumcoders.vercel.app. Features: 7 main sections (Home, About, Team, Projects, Memories, Achievements, Contact), AI chatbot, theme toggle, responsive design, and additional resource pages."
      });
    }
    
    // Generic fallback
    return res.status(500).json({
      reply: "⚠️ Sorry, I'm having trouble processing your request. Please email us at quantumcoderstechlab@gmail.com for assistance with: '" + message.substring(0, 50) + "...'"
    });
  }
}