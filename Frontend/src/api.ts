import type {
    Email,
    FetchAccountsResponse,
    FetchEmailResponse,
    FetchFolderResponse,
} from "./types/type";

export const API_BASE = "http://localhost:3001";

/* ------------------------------------------------------------------
   MOCK SAMPLE DATA
-------------------------------------------------------------------*/

export const MOCK_EMAILS: Email[] = [
    {
        id: "1",
        subject: "Welcome to our service!",
        from: "support@example.com",
        snippet: "Thank you for signing up. Here’s how to get started...",
        category: "Onboarding",
        reply: "Thank you for the warm welcome! I'm excited to get started.",
    },
    {
        id: "2",
        subject: "Your Invoice for November",
        from: "billing@example.com",
        snippet: "Your monthly invoice is ready to download...",
        category: "Billing",
        reply: "Thank you for the invoice. I will review it and get back to you if I have any questions.",
    },
    {
        id: "3",
        subject: "Meeting tomorrow at 10 AM",
        from: "boss@company.com",
        snippet: "Reminder: We have a meeting tomorrow regarding Q4 goals.",
        category: "Work",
    },
    {
        id: "4",
        subject: "50% Discount on Your Next Purchase!",
        from: "sales@shop.com",
        snippet: "Exclusive offer only for you...",
        category: "Promotions",
    },
];

export const MOCK_FOLDERS: Record<string, Email[]> = {
    inbox: MOCK_EMAILS.slice(0, 3),
    promotions: [MOCK_EMAILS[3]],
    work: [MOCK_EMAILS[2]],
};

export const MOCK_ACCOUNTS: string[] = ["personal@example.com", "work@example.com"];

/* ------------------------------------------------------------------
   API CALLS — fallback to mock data if backend is offline
-------------------------------------------------------------------*/

async function safeFetch(url: string) {
    try {
        const res = await fetch(url);
        return res.json();
    } catch (e) {
        console.warn("Backend offline → Using mock data for:", url);
        return null;
    }
}

export async function fetchEmails(search: string = ""): Promise<FetchEmailResponse> {
    const response = await safeFetch(`${API_BASE}/emails?search=${search}`);

    if (response) return response;

    // MOCK FILTER LOGIC
    const filtered = MOCK_EMAILS.filter(
        (email) =>
            email.subject.toLowerCase().includes(search.toLowerCase()) ||
            email.from.toLowerCase().includes(search.toLowerCase())
    );

    return { data: filtered };
}

export async function fetchByFolder(folder: string): Promise<FetchFolderResponse> {
    const response = await safeFetch(`${API_BASE}/folder/${folder}`);
    if (response) return response;

    return { emails: MOCK_FOLDERS[folder] || [] };
}

export async function fetchByAccount(account: string): Promise<FetchEmailResponse> {
    const response = await safeFetch(`${API_BASE}/account/${account}`);
    if (response) return response;

    // Just return all emails for mock
    return { data: MOCK_EMAILS };
}

export async function fetchAllAccounts(): Promise<FetchAccountsResponse> {
    const response = await safeFetch(`${API_BASE}/accounts`);
    if (response) return response;

    return { accounts: MOCK_ACCOUNTS };
}

export async function fetchEmailById(id: string): Promise<Email> {
    const response = await safeFetch(`${API_BASE}/email/${id}`);
    if (response) return response;

    const email = MOCK_EMAILS.find((e) => e.id === id);
    return email || MOCK_EMAILS[0];
}
