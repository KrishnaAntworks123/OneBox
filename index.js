import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";
import { setupElasticsearch } from "./elasticSearch/index.js";
import { normalizeFolder, StoreEmail } from "./Utils/Emails.js";
import { EmailCategorization } from "./Utils/EmailCategory.js";
import { sendSlackNotification } from "./Notification/slack.js";
import { sendWebhook } from "./Notification/webhook.js";

dotenv.config();

async function syncEmails() {
  // IMAP CLIENT SETUP
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

  // LISTEN FOR NEW EMAILS
  client.on("exists", async (info) => {
    const seq = info.count;

    try {
      if (!client.mailbox || client.mailbox.path !== "INBOX") {
        // Save but don't categorize
        const msg = await client.fetchOne(seq, { source: true });
        const parsed = await simpleParser(msg.source);

        await StoreEmail(parsed, seq, client, "Not_Applicable");
        console.log(`Stored NON-INBOX new mail: ${parsed.subject}`);
        return;
      }

      console.log("INBOX email arrived:", seq);

      const msg = await client.fetchOne(seq, { source: true });
      const parsed = await simpleParser(msg.source);

      //  Categorize only INBOX
      const categoryResponse = await EmailCategorization(parsed.text);
      const predictedCategory = categoryResponse.predicted_label;

      if (predictedCategory === "Interested") {
        await sendSlackNotification(parsed);
        await sendWebhook(parsed);
      }

      const normalizedFolder = normalizeFolder(folder);
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
    // Skip All Mail folder
    if (folder === "[Gmail]/All Mail") {
      console.log("Skip All Mails");
      continue;
    }
    console.log(`Syncing folder: ${folder}`);
    await client.mailboxOpen(folder);

    const messages = await client.search({ since });

    for await (let msg of client.fetch(messages, { envelope: true, source: true })) {
      const parsed = await simpleParser(msg.source);

      let predictedCategory = "Not_Applicable";

      // categorize ONLY INBOX during initial sync
      if (folder === "INBOX") {
        const categoryResponse = await EmailCategorization(parsed.text);
        predictedCategory = categoryResponse.predicted_label;

        if (predictedCategory === "Interested") {
          await sendSlackNotification(parsed);
          await sendWebhook(parsed);
        }
      }
      const normalizedFolder = normalizeFolder(client.mailbox.path);

      await StoreEmail(parsed, msg.uid, client, predictedCategory, normalizedFolder);

      console.log(`Stored email (${folder}): ${parsed.subject}`);
    }
  }

  console.log("Initial sync done.");

  await client.mailboxOpen("INBOX");
  console.log("📬 Waiting for new INBOX emails... (IDLE)");

  await new Promise(() => { }); // keep running
}

(async function main() {
  await setupElasticsearch();
  await syncEmails();
})();
