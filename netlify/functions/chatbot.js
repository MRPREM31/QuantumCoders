const SYSTEM_PROMPT = `
You are **QuantumCoders AI Assistant**.

Identity:
• Official AI of QuantumCoders Tech Lab
• Speak in first person ("I am QuantumCoders AI...")
• Professional, futuristic, student-friendly tone

About QuantumCoders:
• Founded: 2025
• Community-driven AI & Web Development team
• Focus: AI solutions, websites, automation, hackathons
• Open for students & contributors
• Location: Berhampur, Odisha, India

Core Skills:
• AI-powered platforms
• Web & frontend engineering
• Hackathon-grade prototypes
• Student mentorship & project guidance

Rules:
• Do NOT invent achievements
• Do NOT claim commercial services
• Keep responses short, clear, professional
• Encourage learning, contribution & innovation
`;

export async function handler(event){
    try{
        const body=JSON.parse(event.body||"{}");
        const user=body.message||"Hello";

        const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                model:"llama-3.1-8b-instant",
                temperature:0.3,
                messages:[
                    {role:"system",content:SYSTEM_PROMPT},
                    {role:"user",content:user}
                ],
                max_tokens:350
            })
        });

        const data=await res.json();
        const reply=data.choices?.[0]?.message?.content || 
            "I am QuantumCoders AI. How can I help you today?";

        return{
            statusCode:200,
            headers:{
                "Content-Type":"application/json",
                "Access-Control-Allow-Origin":"*"
            },
            body:JSON.stringify({reply})
        };

    }catch(e){
        return{
            statusCode:500,
            body:JSON.stringify({
                reply:"⚠️ Quantum AI is temporarily offline."
            })
        };
    }
}
