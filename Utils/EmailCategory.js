import axios from "axios"
import { response } from "express"
import dotenv from "dotenv"

dotenv.config();

export async function EmailCategorization(msg) {
    if (!msg || msg.trim().length < 3) {
        return "Not_Applicable";
    }
    const response = await axios.post(process.env.EMAIL_CATEGORIZATION_URL, { body: msg })
    return response.data;
}