// File: addMoreData.ts
import { Document } from "@langchain/core/documents";
import { CohereEmbeddings } from "@langchain/cohere";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";
import { DocumentData } from "../Utils/DocumentData";

dotenv.config();


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


    await vectorStore.addDocuments(DocumentData);

    const results = await vectorStore.similaritySearch("interview", 1);
    console.log("Test search for 'interview':", results);
}
