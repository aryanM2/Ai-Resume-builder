import getOpenAI from "../config/ai.js";
import Resume from "../models/resume.js";

//ai enhacing summary of user
export const enhanceProfessionalSummary= async(req,res)=>{
try{


    const {userContent} = req.body;

    if(!userContent){
        return res.status(400).json({message:"User content is required"});
    }
    
    const response= await getOpenAI().chat.completions.create({
        model:process.env.AI_MODEL,
        messages:[
            {
                role:"system",
                content:"You are a professional resume writer. Your task is to enhance the user's professional summary in 2-3 lines to make it more compelling and impactful. Return only the enhanced summary, nothing else."
            },
            {
                role:"user",
                content:userContent
            }
        ]
    })

    const enhancedSummary = response.choices[0].message.content;
    return res.status(201).json({enhancedSummary})
    
}catch(error){
    console.error("Error in enhanceProfessionalSummary:", error);
    if (error.status === 429 || error.status === 503 || error.code === 'insufficient_quota' || error.message?.includes('quota')) {
        return res.status(503).json({message:"AI feature is currently unavailable due to high demand. Please try again later."});
    }
    return res.status(500).json({message:"Internal server error"});
}
}

//ai enhancing job description
export const enhanceJD= async(req,res)=>{
    try {
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message:"User content is required"});
        }

        const response = await getOpenAI().chat.completions.create({
            model: process.env.AI_MODEL,
            messages:[
                {
                    role:'system',
                    content: "Rewrite into 3-4 ATS-friendly resume bullet points. Each bullet must be under 15 words. Start with an action verb. Include keywords and metrics when possible. Return only bullet points."
                },
                {
                    role:'user',
                    content:userContent
                }   
            ]
        })
        const enhancedJD = response.choices[0].message.content;
        return res.status(201).json({enhancedJD})
    } catch (error) {
        console.error("Error in enhanceJD:", error);
        if (error.status === 429 || error.status === 503 || error.code === 'insufficient_quota' || error.message?.includes('quota')) {
            return res.status(503).json({message:"AI feature is currently unavailable due to high demand. Please try again later."});
        }
        return res.status(500).json({message:"Internal server error"});
    }
    
}

//ai enhancing project description
export const enhanceProject= async(req,res)=>{
    try {
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message:"User content is required"});
        }

        const response = await getOpenAI().chat.completions.create({
            model: process.env.AI_MODEL,
            messages:[
                {
                    role:'system',
                    content: "Rewrite into 3-4 bullet points for a project. Each bullet must be under 12 words. Highlight technologies used and impact. Return only bullet points."
                },
                {
                    role:'user',
                    content:userContent
                }   
            ]
        })
        const enhancedProject = response.choices[0].message.content;
        return res.status(201).json({enhancedProject})
    } catch (error) {
        console.error("Error in enhanceProject:", error);
        if (error.status === 429 || error.status === 503 || error.code === 'insufficient_quota' || error.message?.includes('quota')) {
            return res.status(503).json({message:"AI feature is currently unavailable due to high demand. Please try again later."});
        }
        return res.status(500).json({message:"Internal server error"});
    }
    
}

const checkSubscription = (req, res, next) => {
    if (!req.user || !req.user.isSubscribed) {
        return res.status(403).json({ message: "Subscription required for this feature." });
    }
    next();
};

//ai ats score analyzer
export const analyzeAts = [checkSubscription, async(req,res)=>{
    try{
        console.log("started generating")
        const { resumeText, jobDescription } = req.body;

        if(!resumeText || !jobDescription){
            return res.status(400).json({message:"Resume text and job description are required"});
        }
        
        const response= await getOpenAI().chat.completions.create({
            model:process.env.AI_MODEL,
            response_format: { type: "json_object" },
            messages:[
                {
                    role:"system",
                    "content":`You are an advanced ATS (Applicant Tracking System) resume analyzer. Your task is to analyze a resume against a job description. Provide a detailed analysis in JSON format. The JSON object must have the following structure: { "matchScore": <number>, "matchSummary": "<string>", "missingKeywords": ["<string>"], "improvementSuggestions": "<string>" }. The matchScore should be a number between 0 and 100. The matchSummary should be a 2-3 sentence summary. The missingKeywords should be an array of important keywords from the job description missing in the resume. The improvementSuggestions should be a single string with actionable suggestions, using '\\n- ' for bullet points. Return only the JSON object.`
                },
                {
                    role:"user",
                    content:`Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
                }
            ]
        })

        const analysisResult = JSON.parse(response.choices[0].message.content);
        return res.status(200).json({analysisResult})
        
    }catch(error){
        console.error("Error in analyzeAts:", error);
        if (error.status === 429 || error.status === 503 || error.code === 'insufficient_quota' || error.message?.includes('quota')) {
            return res.status(503).json({message:"AI analysis feature is currently unavailable due to high demand. Please try again later."});
        }
        return res.status(500).json({message:"Internal server error"});
    }
}]
