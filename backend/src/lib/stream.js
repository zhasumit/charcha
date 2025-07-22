import { StreamChat } from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if (!apiKey || !apiSecret) {
    console.log("Stream API key or SECRET missing!")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret)
streamClient.axiosInstance.defaults.timeout = 10000; // 10 sec timeout

export const upsertStreamUser = async (userData) => {
    try {
        // create if doesnot exist other wise update -> upsert (insert + up = upsert)
        await streamClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.error("Error upserting stream user", error)
    }
}

export const generateStreamToken = (userId) => { 
    try {
        const userIdString = userId.toString()
        return streamClient.createToken(userIdString)
    } catch (error) {
        console.log("Error generating Stream token:", error)
    }
}