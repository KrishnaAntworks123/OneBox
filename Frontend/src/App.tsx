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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📧 Email Dashboard</h1>

      <Filters setEmails={setEmails} setLoading={setLoading} />

      {loading ? (
        <p className="text-gray-500 mt-4">Loading...</p>
      ) : (
        <EmailList emails={emails} />
      )}
    </div>
  );
}
