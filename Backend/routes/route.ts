import express from 'express';
import dotenv from 'dotenv';
import { esClient } from '../elasticSearch/index';
import { getEmailByIdController, getEmailsByAccountController, getEmailsByFolderController, getEmailsController, getEmailSummaryController, getUniqueAccountsController } from "../Controller/emailController";

dotenv.config();

const router = express.Router();

const esIndex = process.env.ELASTICSEARCH_INDEX || 'emails';

async function checkEsConnection() {
    try {
        await esClient.ping();
        console.log('Elasticsearch client connected for API server.');
    } catch (err: any) {
        console.error('Could not connect to Elasticsearch for API server:', err.message);
        process.exit(1);
    }
}

router.get("/emails", getEmailsController);

router.get("/email/:id", getEmailByIdController)

router.get("/email/summary/:id", getEmailSummaryController)

router.get('/folder/:folder', getEmailsByFolderController);

router.get("/account/:account", getEmailsByAccountController);

router.get("/accounts", getUniqueAccountsController);
export { checkEsConnection };

export default router;
