import express from 'express';
import dotenv from 'dotenv';
import { esClient } from '../elasticSearch/index.js';
import { getEmailsByAccountController, getEmailsByFolderController, getEmailsController } from "../Controller/emailController.js";

dotenv.config();

const router = express.Router();

const app = express();
app.use(express.json());

const API_PORT = process.env.API_PORT || 3001;
const esIndex = process.env.ELASTICSEARCH_INDEX || 'emails';


/**
 * Helper function to check Elasticsearch connection
*/
async function checkEsConnection() {
    try {
        await esClient.ping();
        console.log('Elasticsearch client connected for API server.');
    } catch (err) {
        console.error('Could not connect to Elasticsearch for API server:', err.message);
        process.exit(1);
    }
}

router.get("/emails", getEmailsController);

router.get('/folder/:folder', getEmailsByFolderController);

router.get("/account/:account", getEmailsByAccountController);


await checkEsConnection();

export default router;