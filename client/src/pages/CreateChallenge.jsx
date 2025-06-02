import { useState, useEffect } from "react";
import axios from "axios";

function CreateChallenge() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState("");

  // Fetch global skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/globalskills");
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  // Submit challenge handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSkill) {
      alert("Please select a skill for this challenge.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/challenges",
        {
          title,
          description,
          difficulty,
          skill: selectedSkill,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Challenge created successfully!");
      // Optional: reset form
      setTitle("");
      setDescription("");
      setDifficulty("Easy");
      setSelectedSkill("");
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Failed to create challenge.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Challenge</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded h-24"
          required
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select a skill</option>
          {skills.map((skill) => (
            <option key={skill._id} value={skill._id}>
              {skill.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Challenge
        </button>
      </form>
    </div>
  );
}

export default CreateChallenge;
