export interface EmailDocument {
    messageId: string;
    subject: string;
    sender: string;
    recipient: string;
    date: Date;
    text: string;
    account: string;
    folder?: string;
    syncedAt: Date;
    category: string;
}

export interface EmailSingleGetResponse {
    _id: string;
    _source: EmailDocument;
    found: boolean;
}

export interface GetSingleEmailByIdResponse extends EmailDocument{
    id: string;
    reply: string;
}