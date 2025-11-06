import { esClient } from "../elasticSearch/index.js";

export async function searchEmailsES(queryBody) {
    const response = await esClient.search({
        index: "emails",
        body: queryBody
    });

    return {
        total: response.hits.total.value,
        emails: response.hits.hits.map(hit => hit._source)
    };
}

export async function searchEmailsByAccount(account, from = 0, size = 20) {

    const response = await esClient.search({
        index: "emails",
        body: {
            from,
            size,
            sort: [{ date: { order: "desc" } }],
            query: {
                term: { account }
            }
        }
    });

    return {
        total: response.hits.total.value,
        emails: response.hits.hits.map(hit => hit._source)
    };
}

export async function getUniqueAccountsService() {
    const queryBody = {
        size: 0,
        aggs: {
            accounts: {
                terms: {
                    field: "account",  // ✅ NOT account.keyword
                    size: 1000
                }
            }
        }
    };

    const res = await esClient.search({
        index: "emails",
        body: queryBody
    });

    const accounts = res.aggregations.accounts.buckets.map(b => b.key);
    return accounts;
}

