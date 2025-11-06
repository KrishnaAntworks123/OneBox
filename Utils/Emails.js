import { indexEmail } from "../elasticSearch/index.js";

export async function StoreEmail(parsed, seq, client, predictedCategory, normalizedFolder) {
    const emailDoc = {
        messageId: parsed.messageId || String(seq),
        subject: parsed.subject || "",
        sender: parsed.from?.text || "",
        recipient: parsed.to?.text || "",
        date: parsed.date ? new Date(parsed.date) : new Date(),
        text: parsed.text || "",
        account: client.options.auth.user,
        folder: normalizedFolder,
        syncedAt: new Date(),
        category: predictedCategory || "uncategorized"
    };

    // Index the new email
    await indexEmail(emailDoc);
}

export function normalizeFolder(folder) {
    const map = {
        "INBOX": "INBOX",
        "[Gmail]/Sent Mail": "Sent",
        "[Gmail]/Drafts": "Drafts",
        "[Gmail]/Spam": "Spam",
        "[Gmail]/Trash": "Trash",
        "[Gmail]/Bin": "Trash",
    };

    return map[folder] || folder;
}
