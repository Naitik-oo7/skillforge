import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeList from "./pages/ChallengeList";
import ChallengeSubmission from "./pages/ChallengeSubmission";
import Register from "./pages/Register";
import UserSubmissions from "./pages/UserSubmissions";
import UserStats from "./pages/UserStats";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submissions/user/:userId" element={<UserSubmissions/>} />
        <Route path="/stats/:userId" element={<UserStats/>} />



        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/create-challenge"
          element={
            <ProtectedRoutes>
              <CreateChallenge />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoutes>
              <ChallengeList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/submit/:challengeId"
          element={
            <ProtectedRoutes>
              <ChallengeSubmission />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
