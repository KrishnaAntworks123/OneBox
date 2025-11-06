import express from 'express';
import dotenv from 'dotenv';
import { esClient } from '../elasticSearch/index.js';
import { sendSlackNotification } from '../Notification/slack.js';
import { sendWebhook } from '../Notification/webhook.js';
import axios from 'axios';

dotenv.config();

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


app.get('/emails', async (req, res) => {
    try {
        const { search, folder, account, category, page = 1, limit = 20 } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const from = (pageNum - 1) * limitNum;

        const queryBody = {
            from: from,
            size: limitNum,
            sort: [
                { date: { order: "desc" } }
            ],
            query: {
                bool: {
                    must: [],
                    filter: []
                }
            }
        };

        if (folder) {
            queryBody.query.bool.filter.push({
                term: { folder }
            });
        }
        if (account) {
            queryBody.query.bool.filter.push({
                term: { account }
            });
        }
        if (category) {
            queryBody.query.bool.filter.push({
                term: { category }
            });
        }
        const searchTerm = search?.trim();

        if (searchTerm && searchTerm.length > 0) {
            queryBody.query.bool.must.push({
                multi_match: {
                    query: searchTerm,
                    fields: ["subject", "text"],
                    fuzziness: "AUTO"
                }
            });
        } else {
            queryBody.query.bool.must.push({ match_all: {} });
        }

        //  Execute Search
        const response = await esClient.search({
            index: esIndex,
            body: queryBody
        });

        const totalHits = response.hits.total.value;
        const emails = response.hits.hits.map(hit => hit._source);

        res.json({
            total: totalHits,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalHits / limitNum),
            data: emails
        });
        // console.log('Elasticsearch response:', response);

    } catch (err) {
        console.error(' API /emails error:', err.meta ? err.meta.body : err);
        res.status(500).json({
            error: "An error occurred while searching emails.",
            details: err.message
        });
    }
});

app.get("/folders", async (req, res) => {
    const { account } = req.query;

    if (!account)
        return res.status(400).json({ error: "Account is required" });

    const response = await esClient.search({
        index: esIndex,
        size: 0,
        aggs: {
            folders: {
                terms: { field: "folder", size: 50 }
            }
        },
        query: {
            term: { account }
        }
    });

    const values = response.aggregations.folders.buckets.map(b => b.key);

    res.json({ account, folders: values });
});


(async () => {
    await checkEsConnection();
    app.listen(API_PORT, () => {
        console.log(`Email API server running on http://localhost:${API_PORT}`);
    });
})();