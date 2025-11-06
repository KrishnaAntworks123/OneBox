import { indexEmail } from "../elasticSearch/index.js";

export async function StoreEmail(parsed, seq, client) {
    const emailDoc = {
        messageId: parsed.messageId || String(seq),
        subject: parsed.subject || "",
        sender: parsed.from?.text || "",
        recipient: parsed.to?.text || "",
        date: parsed.date ? new Date(parsed.date) : new Date(),
        text: parsed.text || "",
        account: client.options.auth.user,
        folder: client.mailbox?.path,
        syncedAt: new Date(),
    };

    // Index the new email
    await indexEmail(emailDoc);
}