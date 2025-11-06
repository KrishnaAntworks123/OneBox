import axios from "axios";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function sendWebhook(parsed: any, client?: any) {
    try {
        await axios.post(WEBHOOK_URL as string, {
            type: "InterestedEmail",
            data: parsed,
            From: parsed.from?.value[0].address,
            Subject: parsed.subject,
            Date: parsed.date
        });

        console.log("Webhook triggered");
    } catch (err: any) {
        console.error("Webhook failed:", err.message);
    }
}
