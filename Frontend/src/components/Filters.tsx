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
        setLoading(true);
        const data = await fetchByAccount(account);
        setEmails(data.data);
        setLoading(false);
    };

    return (
        <div className="flex gap-3 items-center mb-4">

            {/* 🔍 Search */}
            <input
                type="text"
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded px-3 py-1"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-3 py-1 rounded"
            >
                Search
            </button>

            {/* 📁 Folder Filters */}
            <select
                onChange={(e) => handleFolder(e.target.value)}
                className="border px-2 py-1 rounded"
            >
                <option value="">Folder</option>
                <option value="INBOX">INBOX</option>
                <option value="Sent">Sent</option>
                <option value="Spam">Spam</option>
            </select>

            {/* 👤 Account Filter */}
            <select
                onChange={(e) => handleAccount(e.target.value)}
                className="border px-2 py-1 rounded"
            >
                <option value="">Account</option>
                {accounts.length === 0 ? (
                    <option value="">No accounts</option>
                ) : (
                    accounts.map((acc) => (
                        <option value={acc} key={acc}>
                            {acc}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
}
