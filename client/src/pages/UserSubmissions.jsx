import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UserSubmissions() {
  const { userId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const res = await axios.get(
          `http://localhost:5000/api/submissions/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubmissions(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, [userId]);

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (submissions.length === 0)
    return <p>No submissions found for this user.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Submissions</h2>
      <ul>
        {submissions.map((sub) => (
          <li
            key={sub._id}
            className="border p-4 mb-3 rounded shadow hover:shadow-md"
          >
            <p>
              <strong>Skill:</strong> {sub.skill?.name || "N/A"}
            </p>
            <p>
              <strong>Code:</strong>
            </p>
            <pre className="bg-gray-100 p-3 rounded font-mono whitespace-pre-wrap">
              {sub.code}
            </pre>
            <p>
              <strong>Status:</strong> {sub.result}
              {sub.result === "Pending" && " (Evaluating...)"}
            </p>

            {sub.aiExplanation && (
              <>
                <p>
                  <strong>AI Explanation:</strong>
                </p>
                <p className="italic bg-gray-50 p-2 rounded text-sm whitespace-pre-wrap">
                  {sub.aiExplanation}
                </p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
