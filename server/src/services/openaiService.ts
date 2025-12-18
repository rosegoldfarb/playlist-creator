import OpenAI from "openai"
// import dotenv from "dotenv";
// dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
})

// TODO: play around with gpt5.1 mini instead of gpt4.1 - should be quicker and cheaper but maybe worse
export const getPlaylist = async (prompt: string) => {   
    // prompt eg: "Upbeat older songs like Then He Kissed Me and Signed, Sealed, Delivered. 15-20 songs."
    try {
        const response = await openai.responses.create({
            model: "gpt-4.1",
            // reasoning: {effort: "low"} -- gpt4.1 is a non-reasoning model so I don't think this is needed
            instructions: "Create a playlist that satisfies the prompt. Provide the response as a json that has array songs, and each song has musician and title.",
            // TODO propagate user prompt
            input: prompt
            // max_tokens
        })
        console.log(response)
        console.log("resp out text: ", response.output_text)
        return response;
    } catch (err) {
        // TODO: graceful error handling - decide where to handle errors (maybe not here) - middleware?
        console.error("OpenAI error: ", err)
        throw err
    }
}
// const response = await openai.responses.create({
//     model: "gpt-4.1",
//     // reasoning: {effort: "low"} -- gpt4.1 is a non-reasoning model so I don't think this is needed
//     instructions: "Create a playlist that satisfies the prompt. Provide the response as a json that has array songs, and each song has musician and title.",
//     // TODO propagate user prompt
//     input: "Upbeat older songs like Then He Kissed Me and Signed, Sealed, Delivered. 15-20 songs."
//     // max_tokens
// })



