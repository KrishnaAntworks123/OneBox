import { indexEmail } from "../elasticSearch/index";

export async function StoreEmail(parsed: any, seq: any, client: any, predictedCategory: string, normalizedFolder?: string) {
    const emailDoc = {
        messageId: parsed.messageId || String(seq),
        subject: parsed.subject || "",
        sender: parsed.from?.text || "",
        recipient: parsed.to?.text || "",
        date: parsed.date ? new Date(parsed.date) : new Date(),
        text: parsed.text?.trim() || "",
        account: client.options.auth.user,
        folder: normalizedFolder,
        syncedAt: new Date(),
        category: predictedCategory || "uncategorized"
    };

    await indexEmail(emailDoc);
}

export function normalizeFolder(folder: string | undefined) {
    const map: Record<string, string> = {
        "INBOX": "INBOX",
        "[Gmail]/Sent Mail": "Sent",
        "[Gmail]/Drafts": "Drafts",
        "[Gmail]/Spam": "Spam",
        "[Gmail]/Trash": "Trash",
        "[Gmail]/Bin": "Trash",
    };

    if (!folder) return "INBOX";
    return map[folder] || folder;
}
