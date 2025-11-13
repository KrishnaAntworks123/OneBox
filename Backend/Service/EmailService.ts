import { esClient } from "../elasticSearch/index";
import { searchEmailsByAccount, searchEmailsES } from "../elasticSearch/emailQueries";

export async function getEmailsByFolder(folder: string, from = 0, size = 50) {
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

    return response.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source
    }));
}


export async function getEmailsService(queryParams: any) {
    const { search, folder, account, category, page = 1, limit = 20 } = queryParams;

    const pageNum = parseInt(page as any, 10) || 1;
    const limitNum = parseInt(limit as any, 10) || 20;
    const from = (pageNum - 1) * limitNum;

    const queryBody: any = {
        from,
        size: limitNum,
        sort: [{ date: { order: "desc" } }],
        query: {
            bool: {
                must: [],
                filter: []
            }
        }
    };

    if (folder) {
        queryBody.query.bool.filter.push({
            term: { "folder.keyword": folder }
        });
    }

    if (account) {
        queryBody.query.bool.filter.push({
            term: { "account.keyword": account }
        });
    }

    if (category) {
        queryBody.query.bool.filter.push({
            term: { "category.keyword": category }
        });
    }

    const searchTerm = search?.trim();
    if (searchTerm) {
        queryBody.query.bool.must.push({
            multi_match: {
                query: searchTerm,
                fields: ["subject", "text"],
                fuzziness: "AUTO"
            }
        });
    }

    const { total, emails } = await searchEmailsES(queryBody);

    return {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(Number(total) / limitNum),
        data: emails
    };
}

export async function getSingleEmailById(id: string) {
    if (!id || id.trim() === "") {
        throw new Error("Email ID is required");
    }

    const emailId = id.trim();

    const response = await esClient.get({
        index: "emails",
        id: emailId
    });

    if (!response.found) {
        throw new Error(`Email with ID ${emailId} not found`);
    }

    return {
        id: response._id,
        ...(response._source as Record<string, any>)
    };
}

export async function getEmailsByAccountService(accountParam: string, queryParams: any) {

    if (!accountParam || accountParam.trim() === "") {
        throw new Error("Account parameter is required");
    }

    const account = accountParam.trim();

    const { page = 1, limit = 20 } = queryParams;

    const pageNum = parseInt(page as any, 10) || 1;
    const limitNum = parseInt(limit as any, 10) || 20;
    const from = (pageNum - 1) * limitNum;

    const { total, emails } = await searchEmailsByAccount(account, from, limitNum);

    return {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(Number(total) / limitNum),
        data: emails
    };
}
