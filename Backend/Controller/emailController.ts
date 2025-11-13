import express from "express";
import { getUniqueAccountsService } from "../elasticSearch/emailQueries";
import { getEmailsByFolder, getEmailsService, getSingleEmailById } from "../Service/EmailService";
import { getEmailsByAccountService } from "../Service/EmailService";
import getReply from "../Service/SuggestReply";

export async function getEmailsController(req: express.Request, res: express.Response) {
    try {
        const result = await getEmailsService(req.query as any);

        res.json(result);

    } catch (err: any) {
        console.error("Controller Error:", err);
        res.status(500).json({
            error: "Failed to fetch emails",
            details: err.message
        });
    }
}

export async function getEmailsByFolderController(req: express.Request, res: express.Response) {
    try {
        const folder = req.params.folder;

        const from = parseInt(req.query.from as string) || 0;
        const size = parseInt(req.query.size as string) || 50;

        const emails = await getEmailsByFolder(folder, from, size);

        res.json({
            folder,
            count: emails.length,
            emails
        });
    } catch (err: any) {
        console.error("Error fetching emails:", err);
        res.status(500).json({ error: "Failed to fetch emails" });
    }
}


export async function getEmailsByAccountController(req: express.Request, res: express.Response) {
    try {
        const account = req.params.account;
        const query = req.query;

        const result = await getEmailsByAccountService(account, query as any);

        res.json(result);
    } catch (err: any) {
        console.error("Account Controller Error:", err);
        res.status(500).json({
            error: "Failed to fetch account emails",
            details: err.message
        });
    }
}

export async function getUniqueAccountsController(req: express.Request, res: express.Response) {
    try {
        const accounts = await getUniqueAccountsService();
        res.json({ success: true, accounts });
    } catch (err: any) {
        console.error("Error fetching accounts", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export async function getEmailByIdController(req: express.Request, res: express.Response) {
    try {
        const emailId = req.params.id;
        const email: any = await getSingleEmailById(emailId);
        const reply = await getReply(email.text);
        email.suggestedReply = reply;
        res.json(email);
    } catch (err: any) {
        console.error("Error fetching email by ID:", err);
        res.status(500).json({ error: "Failed to fetch email by ID" });
    }
}