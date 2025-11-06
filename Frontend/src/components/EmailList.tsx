import type { Email } from "../types/type";

interface EmailListProps {
    emails: Email[];
}

export default function EmailList({ emails }: EmailListProps) {
    console.log("Rendering EmailList with emails:", emails);
    if (!emails || emails.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-slate-500 text-lg">📭 No emails to display</p>
            </div>
        );
    }

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
                    className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 hover:border-slate-300"
                >
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate text-lg">
                                {email.subject || "(No Subject)"}
                            </h3>
                        </div>

                        {/* Category Badge */}
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap shrink-0 ${getCategoryColor(email.category)}`}>
                            {email.category || "Uncategorized"}
                        </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-3 flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        <span className="truncate">{email.from}</span>
                    </p>

                    <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
                        {email.snippet}
                    </p>
                </div>
            ))}
        </div>
    );
}
