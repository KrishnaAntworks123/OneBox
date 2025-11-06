import { useEffect, useState } from "react";
import { fetchEmails, fetchByFolder, fetchByAccount, fetchAllAccounts } from "../api";
import type { Email } from "../types/type";

interface FiltersProps {
    setEmails: (emails: Email[]) => void;
    setLoading: (v: boolean) => void;
}

export default function Filters({ setEmails, setLoading }: FiltersProps) {
    const [search, setSearch] = useState<string>("");
    const [accounts, setAccounts] = useState<string[]>([]);

    const handleSearch = async () => {
        setLoading(true);
        const data = await fetchEmails(search);
        setEmails(data.data);
        setLoading(false);
    };

    const handleFolder = async (folder: string) => {
        if (!folder) return;
        setSearch("")
        setLoading(true);
        const data = await fetchByFolder(folder);
        setEmails(data.emails);
        setLoading(false);
    };

    // Fetch accounts once on mount and populate account select
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await fetchAllAccounts();
                if (!mounted) return;
                if (data && Array.isArray(data.accounts)) {
                    setAccounts(data.accounts);
                } else {
                    console.warn("fetchAllAccounts returned unexpected shape", data);
                }
            } catch (err) {
                console.error("Failed to fetch accounts", err);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const handleAccount = async (account: string) => {
        if (!account) return;
        setSearch("")
        setLoading(true);
        const data = await fetchByAccount(account);
        setEmails(data.data);
        setLoading(false);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* 🔍 Search */}
                <div className="flex-1 flex gap-2 min-w-0">
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1 min-w-0 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition whitespace-nowrap"
                    >
                        Search
                    </button>
                </div>

                {/* Folder Filters */}
                <select
                    onChange={(e) => handleFolder(e.target.value)}
                    className="border border-slate-300 px-4 py-2 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                >
                    <option value="">All Folders</option>
                    <option value="INBOX">Inbox</option>
                    <option value="Sent">Sent</option>
                    <option value="Spam">Spam</option>
                </select>

                {/* 👤 Account Filter */}
                <select
                    onChange={(e) => handleAccount(e.target.value)}
                    className="border border-slate-300 px-4 py-2 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                >
                    <option value="">All Accounts</option>
                    {accounts.length === 0 ? (
                        <option value="" disabled>No accounts available</option>
                    ) : (
                        accounts.map((acc) => (
                            <option value={acc} key={acc}>
                                {acc}
                            </option>
                        ))
                    )}
                </select>
            </div>
        </div>
    );
}
