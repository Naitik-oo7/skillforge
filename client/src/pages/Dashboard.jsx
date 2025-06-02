import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // fix import, it’s default export

import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token decode error", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.get(
          "http://localhost:5000/api/stats/leaderboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLeaderboard(res.data);
      } catch (err) {
        setLeaderboardError(
          err.response?.data?.message || err.message || "Failed to load leaderboard"
        );
      } finally {
        setLoadingLeaderboard(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link
          to={`/submissions/user/${user.id}`}
          className="bg-white p-6 rounded shadow hover:shadow-lg transition block"
        >
          Your Code Submissions
        </Link>
        <Link
          to="/challenges"
          className="bg-white p-6 rounded shadow hover:shadow-lg transition block"
        >
          Available Challenges
        </Link>
        <Link
          to={`/stats/${user.id}`}
          className="bg-white p-6 rounded shadow hover:shadow-lg transition block"
        >
          Stats
        </Link>
        {user.isAdmin && (
          <Link
            to="/admin"
            className="bg-white p-6 rounded shadow hover:shadow-lg transition block"
          >
            Admin Panel
          </Link>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard - Top 5 Users</h2>

        {loadingLeaderboard ? (
          <p>Loading leaderboard...</p>
        ) : leaderboardError ? (
          <p className="text-red-500">{leaderboardError}</p>
        ) : leaderboard.length === 0 ? (
          <p>No leaderboard data available.</p>
        ) : (
          <ol className="list-decimal list-inside space-y-2 text-lg">
            {leaderboard.map(({ userId, name, passedCount }) => (
              <li key={userId} className="flex justify-between">
                <span>{name}</span>
                <span className="font-semibold">{passedCount} passed</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
