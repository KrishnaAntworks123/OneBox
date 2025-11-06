import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import * as dotenv from "dotenv";
dotenv.config();

async function syncEmails() {
  // ===== IMAP Connection =====
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Connect to IMAP
    await client.connect();
    await client.mailboxOpen("INBOX");

    // Date range (last 30 days)
    const since = new Date();
    since.setDate(since.getDate() - 30);

    // Search IMAP for emails since date
    const messages = (await client.search({ since })) || [];

    console.log(` Found ${messages.length} emails from last 30 days`);
    console.log(`${messages}`);

    // Fetch and store
    for await (let msg of client.fetch(messages, {
      envelope: true,
      source: true,
    })) {
      const parsed = await simpleParser(msg.source);

      const messageId = parsed.messageId || "";
      const subject = parsed.subject || "";
      const sender = parsed.from?.text || "";
      const recipient = parsed.to?.text || "";
      const date = parsed.date ? new Date(parsed.date) : new Date();
      const text = parsed.text || "";
      const html = parsed.html || "";

      console.log(` Stored: ${subject}`);
      console.log(` Message: ${text}`);
    }
  } catch (err) {
    console.error("⚠ IMAP Sync Error:", err);
  } finally {
    // Clean up
    await client.logout();
    // await db.end();
    console.log("✅ Sync complete and connections closed.");
  }
}

syncEmails();
