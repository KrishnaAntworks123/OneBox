import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";
import { setupElasticsearch } from "./elasticSearch/index";
import { normalizeFolder, StoreEmail } from "./Utils/Emails";
import { EmailCategorization } from "./Utils/EmailCategory";
import { sendSlackNotification } from "./Notification/slack";
import { sendWebhook } from "./Notification/webhook";
import { classifyEmail } from "./Utils/classifyEmail";

dotenv.config();

async function syncEmails() {
    const client = new ImapFlow({
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        logger: false,
    });

    client.on("exists", async (info: any) => {
        const seq = info.count;

        try {
            if (!client.mailbox || client.mailbox.path !== "INBOX") {
                const msg = await client.fetchOne(seq, { source: true });
                if (!msg) {
                    console.warn(`Message ${seq} not found (non-INBOX)`);
                    return;
                }
                const parsed = await simpleParser(msg.source);

                await StoreEmail(parsed, seq, client, "Not_Applicable");
                console.log(`Stored NON-INBOX new mail: ${parsed.subject}`);
                return;
            }

            console.log("INBOX email arrived:", seq);

            const msg = await client.fetchOne(seq, { source: true });
            if (!msg) {
                console.warn(`Message ${seq} not found (INBOX)`);
                return;
            }
            const parsed = await simpleParser(msg.source);

            const predictedCategory = await classifyEmail(parsed.text);

            if (predictedCategory === "Interested") {
                await sendSlackNotification(parsed);
                await sendWebhook(parsed);
            }

            const normalizedFolder = normalizeFolder((client.mailbox && client.mailbox.path) || "INBOX");
            await StoreEmail(parsed, msg.uid, client, predictedCategory, normalizedFolder);

        } catch (err) {
            console.error("Error in new mail handler:", err);
        }
    });

    await client.connect();
    console.log("Connected to IMAP");

    const since = new Date();
    since.setDate(since.getDate() - 2);

    console.log("Fetching mailbox list...");
    const mailboxes = await client.list();

    console.log("Starting initial sync of ALL folders...");

    for (const mailbox of mailboxes) {
        const folder = mailbox.path;

        if (mailbox.flags.has("\\Noselect")) {
            console.log(`Skipping unselectable folder: ${folder}`);
            continue;
        }
        console.log(`Processing folder: ${folder}`);
        if (folder === "INBOX" || folder === "Sent" || folder === "[Gmail]/Sent Mail" || folder === "[Gmail]/Drafts" || folder === "[Gmail]/Trash" || folder === "[Gmail]/Drafts") {
            console.log(`Syncing folder: ${folder}`);
            await client.mailboxOpen(folder);

            const messages = await client.search({ since });

            if (!messages || messages.length === 0) {
                console.log(`No messages to sync in folder: ${folder}`);
            } else {
                for await (let msg of client.fetch(messages, { envelope: true, source: true })) {
                    const parsed = await simpleParser(msg.source);

                    let predictedCategory = "Not_Applicable";

                    if (folder === "INBOX") {
                        predictedCategory = await classifyEmail(parsed.text);

                        if (predictedCategory === "Interested") {
                            await sendSlackNotification(parsed);
                            await sendWebhook(parsed);
                        }
                    }
                    // @ts-ignore
                    const normalizedFolder = normalizeFolder(client.mailbox.path);

                    await StoreEmail(parsed, msg.uid, client, predictedCategory, normalizedFolder);

                    console.log(`Stored email (${folder}): ${parsed.subject}`);
                }
            }
        }

    }

    console.log("Initial sync done.");

    await client.mailboxOpen("INBOX");
    console.log(" Waiting for new INBOX emails... (IDLE)");

    await new Promise(() => { });
}

(async function main() {
    await setupElasticsearch();
    await syncEmails();
})();
