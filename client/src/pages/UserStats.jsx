import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UserStats() {
  const { userId } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.get(
          `http://localhost:5000/api/stats/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!stats) return <p>No stats available.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Submission Stats</h2>
      <ul className="space-y-2 text-lg">
        <li>
          <strong>Total submissions:</strong> {stats.total}
        </li>
        <li>
          <strong>Passed:</strong> {stats.passed}
        </li>
        <li>
          <strong>Failed:</strong> {stats.failed}
        </li>
        <li>
          <strong>Pending:</strong> {stats.pending}
        </li>
      </ul>
    </div>
  );
}
