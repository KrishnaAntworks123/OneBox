import { getEmailsByFolder, getEmailsService } from "../Service/EmailService.js";
import { getEmailsByAccountService } from "../Service/EmailService.js";

export async function getEmailsController(req, res) {
    try {
        const result = await getEmailsService(req.query);

        res.json(result);

    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({
            error: "Failed to fetch emails",
            details: err.message
        });
    }
}

export async function getEmailsByFolderController(req, res) {
    try {
        const folder = req.params.folder;

        // Pagination
        const from = parseInt(req.query.from) || 0;
        const size = parseInt(req.query.size) || 50;

        const emails = await getEmailsByFolder(folder, from, size);

        res.json({
            folder,
            count: emails.length,
            emails
        });
    } catch (err) {
        console.error("Error fetching emails:", err);
        res.status(500).json({ error: "Failed to fetch emails" });
    }
}


export async function getEmailsByAccountController(req, res) {
    try {
        const account = req.params.account;  // from URL
        const query = req.query;             // for pagination, search, etc.

        const result = await getEmailsByAccountService(account, query);

        res.json(result);
    } catch (err) {
        console.error("Account Controller Error:", err);
        res.status(500).json({
            error: "Failed to fetch account emails",
            details: err.message
        });
    }
}
