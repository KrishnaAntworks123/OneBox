import { useState, useEffect } from "react";
import EmailList from "./components/EmailList";
import Filters from "./components/Filters";
import type { Email, FetchEmailResponse } from "./types/type";
import { fetchEmails } from "./api";

export default function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load all emails initially
  useEffect(() => {
    loadAllEmails();
  }, []);

  const loadAllEmails = async () => {
    setLoading(true);
    const data: FetchEmailResponse = await fetchEmails();
    setEmails(data.data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">Email Dashboard</h1>
          </div>
          <p className="text-slate-600">Manage and organize all your emails in one place</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Filters setEmails={setEmails} setLoading={setLoading} />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : emails.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No emails found</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 mb-4">{emails.length} email{emails.length !== 1 ? 's' : ''} found</p>
            <EmailList emails={emails} />
          </div>
        )}
      </div>
    </div>
  );
}
