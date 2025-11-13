import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatCohere, CohereEmbeddings } from "@langchain/cohere";
import { } from "@langchain/cohere"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";

dotenv.config();

console.log("Loaded Google API KEY:", process.env.SLACK_WEBHOOK_URL);
// 1. Initialize the LLM 
const llm = new ChatCohere({
    apiKey: process.env.COHERE_API_KEY,
    model: "command-a-03-2025",
    temperature: 0.3,
});

// 2. Initialize Embeddings and load the Vector Store 
const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API_KEY,
    model: "embed-english-v3.0"
});


const persistDirectory = "./chroma_db";
const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName: "product_and_agenda",
    url: "http://localhost:8000",
});

const retriever = vectorStore.asRetriever({
    k: 2,
});

const systemPrompt = `
You are an expert email assistant. You must use the provided "Context" to draft a concise, professional reply to the "Incoming Email".
- If the context provides a specific instruction (like a link or a talking point), you *must* use it in your reply.
- If the context is not relevant, just write a polite, professional reply.

Context:
<context>
{context}
</context>

Incoming Email:
<email>
{input}
</email>

Suggested Reply:`;

const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
]);

const combineDocsChain = await createStuffDocumentsChain({
    llm: llm,
    prompt: prompt,
});

const retrievalChain = await createRetrievalChain({
    retriever: retriever,
    combineDocsChain: combineDocsChain,
});

export default async function getReply(emailBody: string) {
    console.log(`\n--- Processing Email: "${emailBody}" ---`);

    const result = await retrievalChain.invoke({
        input: emailBody
    });

    console.log(result.context);

    console.log(result.answer);
}

// const emailFromRecruiter = "Hi, Your resume has been shortlisted. When will be a good time for you to attend the technical interview?";



// (async () => {
//     await getReply(emailFromRecruiter);
// })();