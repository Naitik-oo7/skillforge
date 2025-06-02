import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ChallengeSubmission() {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [error, setError] = useState("");
  const [loadingSkills, setLoadingSkills] = useState(true);

 useEffect(() => {
  async function fetchSkills() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found, please login");
        setLoadingSkills(false);
        return;
      }
      const res = await axios.get("http://localhost:5000/api/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Skills response data:", res.data);
      setSkills(res.data);
      if (res.data.length > 0) setSelectedSkill(res.data[0]._id);
    } catch (err) {
      setError("Failed to load skills: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingSkills(false);
    }
  }
  fetchSkills();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Code cannot be empty");
      return;
    }
    if (!selectedSkill) {
      setError("Please select a skill");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/submissions",
        {
          challenge: challengeId,
          skill: selectedSkill,
          code,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Submission successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    }
  };

  if (loadingSkills) return <p>Loading skills...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Your Solution</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold" htmlFor="skill">
            Select Skill
          </label>
          <select
            id="skill"
            className="w-full p-2 border rounded"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            {skills.map((skill) => (
              <option key={skill._id} value={skill._id}>
                {skill.name} ({skill.proficiency})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold" htmlFor="code">
            Code
          </label>
          <textarea
            id="code"
            rows="12"
            className="w-full p-3 border rounded font-mono"
            placeholder="// Write or paste your code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
