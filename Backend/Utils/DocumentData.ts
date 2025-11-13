import { Document } from "@langchain/core/documents";

export const DocumentData: Document[] = [
    new Document({
        pageContent: "I am applying for a job position. If a lead or recruiter is interested in scheduling an interview, I should share my meeting booking link which is: https://cal.com/example",
        metadata: { source: "job_policy", type: "instruction" }
    }),
    new Document({
        pageContent: `If asked to share a portfolio or GitHub, respond with a short pointer: "You can review my projects here: https://github.com/example and my live portfolio at https://portfolio.example.com. Happy to walk through specific projects on the call."`,
        metadata: { source: "templates", type: "reply_example", intent: "share_portfolio" }
    }),
    new Document({
        pageContent: `When receiving a salary question early in the process, respond politely: "I'm focused on fit and the role; I'm open to discussing compensation once we confirm mutual interest. Could you share the salary range for this role?"`,
        metadata: { source: "templates", type: "reply_example", intent: "salary_inquiry" }
    }),
    new Document({
        pageContent: `Our company builds a modern Onebox Email Aggregator similar to Reachinbox. The platform synchronizes multiple IMAP accounts in real time, provides a unified inbox, and enables powerful search, categorization, and workflow automation for sales and recruiting teams.`,
        metadata: { type: "company_info", intent: "describe_company" }
    }),
    new Document({
        pageContent: "If a lead shows interest, respond with enthusiasm and include the booking link: https://cal.com/example. Offer to walk them through a quick product demo.",
        metadata: { cat: "sales", intent: "lead_interested" }
    }),
    new Document({
        pageContent: "If a user reports an issue, start by acknowledging the problem, asking for logs/screenshot, and assuring them a fix is underway.",
        metadata: { cat: "support", intent: "bug_report" }
    }),
]