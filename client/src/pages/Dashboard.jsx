import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let username = "User";
  if (token) {
    const decoded = jwtDecode(token);
    username = decoded.name;
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome, {username}</h1>

      <button
        onClick={() => navigate("/submit-challenge")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition mb-6"
      >
        Submit New Challenge
      </button>

      <h2 className="text-2xl font-semibold mb-2">Your Completed Challenges</h2>

      {/* Replace this with fetched data later */}
      <ul className="w-96">
        <li className="p-4 bg-white rounded shadow mb-2">
          Challenge 1: Array Reverse
        </li>
        <li className="p-4 bg-white rounded shadow mb-2">
          Challenge 2: FizzBuzz
        </li>
        <li className="p-4 bg-white rounded shadow mb-2">
          Challenge 3: Binary Search
        </li>
      </ul>

      <button
        onClick={handleLogout}
        className="mt-10 px-5 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
