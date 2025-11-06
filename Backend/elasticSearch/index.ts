import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";

dotenv.config();

export const esIndex = "emails";

export const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
});

export async function setupElasticsearch() {
    try {
        const existsResp = await esClient.indices.exists({ index: esIndex });
        const exists = typeof existsResp === "boolean" ? existsResp : (existsResp as any).body;

        if (!exists) {
            console.log(`Creating Elasticsearch index: ${esIndex}`);
            await esClient.indices.create({
                index: esIndex,
                body: {
                    mappings: {
                        properties: {
                            date: { type: "date" },
                            sender: { type: "text" },
                            recipient: { type: "text" },
                            subject: { type: "text" },
                            text: { type: "text" },
                            category: { type: "keyword" },
                            account: { type: "keyword" },
                            folder: { type: "keyword" },
                        },
                    },
                },
            });
            console.log(`Index ${esIndex} created.`);
        } else {
            console.log(` Elasticsearch index ${esIndex} already exists.`);
        }
    } catch (err) {
        console.error("Elasticsearch setup error:", err);
        throw err;
    }
}

export async function indexEmail(emailData: any) {
    try {
        await esClient.index({
            index: esIndex,
            id: emailData.messageId,
            body: emailData,
            refresh: "true",
        });
    } catch (err: any) {
        console.error("Elasticsearch indexing error:", err);
    }
}
