import { esClient } from "../elasticSearch/index.js";
import { searchEmailsByAccount } from "../elasticSearch/emailQueries.js";

export async function getEmailsByFolder(folder, from = 0, size = 50) {
    const response = await esClient.search({
        index: "emails",
        from,
        size,
        sort: [{ date: { order: "desc" } }],
        query: {
            term: {
                folder: folder
            }
        }
    });

    // Format results
    return response.hits.hits.map(hit => ({
        id: hit._id,
        ...hit._source
    }));
}


import { searchEmailsES } from "../elasticSearch/emailQueries.js";

export async function getEmailsService(queryParams) {

    const { search, folder, account, category, page = 1, limit = 20 } = queryParams;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const from = (pageNum - 1) * limitNum;

    // Build Elasticsearch Query Body
    const queryBody = {
        from: from,
        size: limitNum,
        sort: [{ date: { order: "desc" } }],
        query: {
            bool: {
                must: [],
                filter: []
            }
        }
    };

    // Folder filter
    if (folder) {
        queryBody.query.bool.filter.push({
            term: { folder }
        });
    }

    // Account filter
    if (account) {
        queryBody.query.bool.filter.push({
            term: { account }
        });
    }

    // Category filter
    if (category) {
        queryBody.query.bool.filter.push({
            term: { category }
        });
    }

    // Search
    const searchTerm = search?.trim();
    if (searchTerm) {
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

    // Execute ES Search
    const { total, emails } = await searchEmailsES(queryBody);

    return {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        data: emails
    };
}


export async function getEmailsByAccountService(accountParam, queryParams) {

    if (!accountParam || accountParam.trim() === "") {
        throw new Error("Account parameter is required");
    }

    const account = accountParam.trim();

    const { page = 1, limit = 20 } = queryParams;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const from = (pageNum - 1) * limitNum;

    const { total, emails } = await searchEmailsByAccount(account, from, limitNum);

    return {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        data: emails
    };
}
