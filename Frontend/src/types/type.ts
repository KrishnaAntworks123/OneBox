export interface Email {
    id: string;
    subject: string;
    from: string;
    snippet: string;
    category?: string;
    reply?: string;
}

export interface FetchEmailResponse {
    data: Email[];
}

export interface FetchFolderResponse {
    emails: Email[];
}


export interface FetchAccountsResponse {
    accounts: string[];
}