import axios from "axios"
import { response } from "express"
import dotenv from "dotenv"

dotenv.config();

export async function EmailCategorization(msg) {
    const response = await axios.post(process.env.EMAIL_CATEGORIZATION_URL, { body: msg })
    return response.data;
}