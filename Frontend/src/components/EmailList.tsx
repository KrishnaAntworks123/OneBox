import { useState } from "react";
import type { Email } from "../types/type";
import { fetchEmailById } from "../api";

interface EmailListProps {
    emails: Email[];
}

export default function EmailList({ emails }: EmailListProps) {
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loadingReply, setLoadingReply] = useState<boolean>(false);

    const handleSuggestReply = async (email: Email) => {
        if (selectedEmail?.id === email.id) {
            setSelectedEmail(null);
            return;
        }

        setLoadingReply(true);

        const fullEmail = await fetchEmailById(email.id);

        setSelectedEmail(fullEmail);
        setLoadingReply(false);
    };

    const getCategoryColor = (category?: string) => {
        const categoryLower = category?.toLowerCase() || "uncategorized";
        const colorMap: Record<string, string> = {
            "interested": "bg-blue-100 text-blue-800 border-blue-300",
            "meeting booked": "bg-green-100 text-green-800 border-green-300",
            "spam": "bg-amber-100 text-amber-800 border-amber-300",
            "out of office": "bg-orange-100 text-orange-800 border-orange-300",
            "not interested": "bg-rose-100 text-rose-800 border-rose-300",
            "Not_Applicable": "bg-slate-100 text-slate-800 border-slate-300"
        }
        return colorMap[categoryLower] || "bg-slate-100 text-slate-800 border-slate-300";
    };

    return (
        <div className="grid gap-4">
            {emails.map((email) => (
                <div
                    key={email.id}
                    className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5"
                >
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate text-lg">
                                {email.subject || "(No Subject)"}
                            </h3>
                        </div>
                        <span
                            className={`text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap ${getCategoryColor(email.category)}`}
                        >
                            {email.category || "Uncategorized"}
                        </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-3 flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        <span className="truncate">{email.from}</span>
                    </p>

                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-3 mb-4">
                        {email.snippet}
                    </p>

                    <button
                        onClick={() => handleSuggestReply(email)}
                        className={`text-sm px-4 py-2 rounded-lg text-white transition
                        ${selectedEmail?.id === email.id 
                            ? "bg-red-500 hover:bg-red-600" 
                            : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {selectedEmail?.id === email.id ? "Close" : "Suggest Reply"}
                    </button>
                    
                    {selectedEmail?.id === email.id && (
                        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                            {loadingReply ? (
                                <div className="flex justify-center py-6">
                                    <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
                                </div>
                            ) : (
                                <>
                                    <h4 className="font-semibold text-slate-900 text-lg mb-2">Suggested Reply</h4>

                                    <p className="text-sm text-slate-700 whitespace-pre-line bg-white border p-3 rounded-md">
                                        {selectedEmail.reply || "No suggestion available."}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
