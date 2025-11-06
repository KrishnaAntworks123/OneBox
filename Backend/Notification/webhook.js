import axios from "axios";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function sendWebhook(parsed, client) {
    try {
        await axios.post(WEBHOOK_URL, {
            type: "InterestedEmail",
            data: parsed,
            From: parsed.from?.value[0].address,
            Subject: parsed.subject,
            Date: parsed.date
        });

        console.log("Webhook triggered");
    } catch (err) {
        console.error("Webhook failed:", err.message);
    }
}
