// File: addMoreData.ts
import { Document } from "@langchain/core/documents";
import { CohereEmbeddings } from "@langchain/cohere";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const jobHuntingDocs = [
    new Document({
        pageContent: "I am applying for a job position. If a lead or recruiter is interested in scheduling an interview, I should share my meeting booking link which is: https://cal.com/example",
        metadata: { source: "job_policy", type: "instruction" }
    }),
];

export default async function addData() {
    console.log("Connecting to models and DB...");

    const embeddings = new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY,
        model: "embed-english-v3.0"
    });


    const vectorStore = await Chroma.fromExistingCollection(embeddings, {
        collectionName: "product_and_agenda",
        url: "http://localhost:8000",
    });


    await vectorStore.addDocuments(jobHuntingDocs);

    console.log("✅ New 'job application' instruction added to the vector store.");

    const results = await vectorStore.similaritySearch("interview", 1);
    console.log("Test search for 'interview':", results);
}
