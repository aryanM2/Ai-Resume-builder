import OpenAI from "openai";

let openai = null;

const getOpenAI = () => {
    if (!openai) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.BASE_URL_AI,
        });
    }
    return openai;
};

export default getOpenAI;