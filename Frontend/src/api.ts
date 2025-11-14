import type { Email, FetchAccountsResponse, FetchEmailResponse, FetchFolderResponse } from "./types/type";

export const API_BASE = "http://localhost:3001";

export async function fetchEmails(search: string = ""): Promise<FetchEmailResponse> {
    const res = await fetch(`${API_BASE}/emails?search=${search}`);
    console.log("Fetched emails with search:", search);
    return res.json();
}

export async function fetchByFolder(folder: string): Promise<FetchFolderResponse> {
    const res = await fetch(`${API_BASE}/folder/${folder}`);
    return res.json();
}

export async function fetchByAccount(account: string): Promise<FetchEmailResponse> {
    const res = await fetch(`${API_BASE}/account/${account}`);
    return res.json();
}

export async function fetchAllAccounts(): Promise<FetchAccountsResponse> {
    const res = await fetch(`${API_BASE}/accounts`);
    return res.json();
}

export async function fetchEmailById(id: string): Promise<Email> {
    const res = await fetch(`${API_BASE}/email/${id}`);
    return res.json();
}