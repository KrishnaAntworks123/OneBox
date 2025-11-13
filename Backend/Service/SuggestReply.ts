import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatCohere, CohereEmbeddings } from "@langchain/cohere";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";

dotenv.config();

// Initialize LLM
const llm = new ChatCohere({
    apiKey: process.env.COHERE_API_KEY,
    model: "command-a-03-2025",
    temperature: 0.3,
});

// Initialize Embeddings
const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY,
    model: "embed-english-v3.0"
});

let vectorStore: any;
let retriever: any;
let retrievalChain: any;

// Async initialization block (fix top-level await)
(async () => {
    vectorStore = await Chroma.fromExistingCollection(embeddings, {
        collectionName: "product_and_agenda",
        url: "http://localhost:8000",
    });

    retriever = vectorStore.asRetriever({ k: 2 });

    const systemPrompt = `
You are an expert email assistant. You must use the provided "Context" to draft a concise, professional reply to the "Incoming Email".
<context>{context}</context>
<email>{input}</email>
Suggested Reply:
`;

    const prompt = ChatPromptTemplate.fromMessages([["system", systemPrompt]]);

    const combineDocsChain = await createStuffDocumentsChain({
        llm,
        prompt,
    });

    retrievalChain = await createRetrievalChain({
        retriever,
        combineDocsChain,
    });
})();

export default async function getReply(emailBody: string) {
    if (!retrievalChain) throw new Error("RAG not initialized yet!");

    const result = await retrievalChain.invoke({
        input: emailBody,
    });

    return result.answer;
}
