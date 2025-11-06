import axios from "axios";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function sendSlackNotification(parsed) {
    if (!SLACK_WEBHOOK_URL) return;

    const message = {
        text: `*New Interested Email*\n*From:* ${parsed.from?.value[0].address}\n*Subject:* ${parsed.subject}\n*Date:* ${parsed.date}`,
    };

    try {
        await axios.post(SLACK_WEBHOOK_URL, message);
        console.log("Slack notification sent");
    } catch (err) {
        console.error("Slack notification failed:", err.message);
    }
}