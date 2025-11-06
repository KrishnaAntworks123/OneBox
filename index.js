import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { setupElasticsearch, indexEmail } from "./elasticSearch/index.js";
import dotenv from "dotenv";
import { StoreEmail } from "./Utils/Emails.js";

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
    console.log("New email arrived. Seq:", seq);

    try {
      // Fetch the new email
      const msg = await client.fetchOne(seq, { source: true });

      const parsed = await simpleParser(msg.source);

      // Index the new email
      await StoreEmail(parsed, seq, client);

      console.log(`Indexed new email: ${parsed.subject}`);
    } catch (err) {
      console.error("Error indexing new email:", err);
    }
  });


  await client.connect();
  await client.mailboxOpen("INBOX");
  console.log("IMAP connected & IDLE mode enabled");

  const since = new Date();
  since.setDate(since.getDate() - 1);

  const messages = await client.search({ since });

  for await (let msg of client.fetch(messages, { envelope: true, source: true })) {
    const parsed = await simpleParser(msg.source);

    // Index the new email
    await StoreEmail(parsed, msg.uid, client);

    console.log(`Initial sync stored: ${parsed.subject}`);
  }

  console.log("Initial email sync done");
  console.log("Waiting for new emails... (IDLE mode ON)");

  // KEEP CONNECTION OPEN FOREVER
  await new Promise(() => { });
}

// MAIN
(async function main() {
  await setupElasticsearch();
  await syncEmails();
})();
