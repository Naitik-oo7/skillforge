import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ChallengeList() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/challenges", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChallenges(res.data);
      } catch (err) {
        console.error("Error fetching challenges:", err);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Challenges</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{challenge.title}</h2>
            <p className="text-gray-600">{challenge.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-blue-600 font-medium">
                Skill: {challenge.skill?.name || "Unknown"}
              </span>
              <span className="text-sm text-gray-500">
                {challenge.difficulty}
              </span>
            </div>
            <Link
              to={`/submit/${challenge._id}`}
              className="text-blue-600 hover:underline"
            >
              Submit Solution
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChallengeList;
