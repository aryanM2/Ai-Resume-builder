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
    if (error.status === 429 || error.code === 'insufficient_quota' || error.message?.includes('quota')) {
        return res.status(503).json({message:"AI enhancement feature is currently unavailable due to quota limits. Please try again later."});
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
        if (error.status === 429 || error.code === 'insufficient_quota' || error.message?.includes('quota')) {
            return res.status(503).json({message:"AI enhancement feature is currently unavailable due to quota limits. Please try again later."});
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
        if (error.status === 429 || error.code === 'insufficient_quota' || error.message?.includes('quota')) {
            return res.status(503).json({message:"AI enhancement feature is currently unavailable due to quota limits. Please try again later."});
        }
        return res.status(500).json({message:"Internal server error"});
    }
    
}
// Parse resume text into structured JSON format using OpenAI
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title } = req.body;
        const userId = req.userId;

        if (!resumeText) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await getOpenAI().chat.completions.create({
            model: process.env.AI_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are an expert resume parser. Your task is to extract structured resume data from the provided resume text. 
                    Return the data in valid JSON format with the following structure:
                    {
                        "personal_info": {
                            "name": "",
                            "email": "",
                            "phone": "",
                            "location": "",
                            "linkedin": "",
                            "github": "",
                            "website": "",
                            "image": ""
                        },
                        "professional_summary": "",
                        "experience": [
                            {
                                "company": "",
                                "position": "",
                                "startDate": "",
                                "endDate": "",
                                "description": ""
                            }
                        ],
                        "education": [
                            {
                                "school": "",
                                "degree": "",
                                "field": "",
                                "startDate": "",
                                "endDate": ""
                            }
                        ],
                        "skills": [],
                        "projects": [
                            {
                                "name": "",
                                "description": "",
                                "technologies": []
                            }
                        ]
                    }
                    Only return the JSON object, no additional text or explanations.`
                },
                {
                    role: "user",
                    content: `extract data from the given resume: ${resumeText}`
                }
            ],
            response_format: {
                type: 'json_object'
            }
        });

        const parsedResume = JSON.parse(response.choices[0].message.content);

        if (parsedResume && Object.keys(parsedResume).length > 0) {
             // Add title and userId to the parsed resume
        parsedResume.title = title || "Untitled Resume";
        parsedResume.userId = userId;
        const newResume = await Resume.create({userId,title,...parsedResume})

        return res.json({resumeId:newResume._id});
        }
        else{
            res.json({message:"empty response from AI"});

        }
        
       
    } catch (error) {
        console.error("Error in uploadResume:", error);
        if (error.status === 429 || error.code === 'insufficient_quota' || error.message?.includes('quota')) {
            return res.status(503).json({message:"AI enhancement feature is currently unavailable due to quota limits. Please try again later."});
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

