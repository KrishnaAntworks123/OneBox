import { esClient } from "./index";

export async function searchEmailsES(queryBody: any) {
    const response = await esClient.search({
        index: "emails",
        body: queryBody
    });

    const total = typeof response.hits.total === "number"
        ? response.hits.total
        : response.hits.total?.value ?? 0;

    return {
        total,
        emails: response.hits.hits.map((hit: any) => hit._source)
    };
}

export async function searchEmailsByAccount(account: string, from = 0, size = 20) {

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

    const total = typeof response.hits.total === "number"
        ? response.hits.total
        : response.hits.total?.value ?? 0;

    return {
        total,
        emails: response.hits.hits.map((hit: any) => hit._source)
    };
}

export async function getUniqueAccountsService() {
    const queryBody = {
        size: 0,
        aggs: {
            accounts: {
                terms: {
                    field: "account",
                    size: 1000
                }
            }
        }
    };

    const res = await esClient.search({
        index: "emails",
        body: queryBody
    });

    // @ts-ignore
    const accounts = res.aggregations.accounts.buckets.map((b: any) => b.key);
    return accounts;
}
