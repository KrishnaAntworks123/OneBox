import type { Email } from "../types/type";

interface EmailListProps {
    emails: Email[];
}

export default function EmailList({ emails }: EmailListProps) {
    console.log("Rendering EmailList with emails:", emails);
    if (!emails || emails.length === 0) {
        return <p className="text-gray-500">No emails found.</p>;
    }

    return (
        <div className="space-y-3">
            {emails.map((email) => (
                <div key={email.id} className="border p-4 rounded shadow-sm">
                    <div className="flex justify-between">
                        <h3 className="font-semibold">
                            {email.subject || "(No Subject)"}
                        </h3>

                        {/* ✅ Categorization Label */}
                        <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                            {email.category || "Uncategorized"}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                        From: {email.from}
                    </p>

                    <p className="mt-2 text-gray-800 text-sm line-clamp-3">
                        {email.snippet}
                    </p>
                </div>
            ))}
        </div>
    );
}
