import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function EmailCategorization(msg: string): Promise<string> {
    if (!msg || msg.trim().length < 3) {
        return "Not_Applicable";
    }
    const response = await axios.post(process.env.EMAIL_CATEGORIZATION_URL as string, { body: msg });
    return response.data;
}
