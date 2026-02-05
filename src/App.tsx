import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Chat from "./components/Chat";
import Friends from "./components/Friends";
import Duel from "./components/Duel";
import QuizGame from "./components/QuizGame";
import LeaderboardPage from "./components/LeaderboardPage";
import ProfilePage from "./pages/ProfilePage";
import GameMode from "./pages/GameMode";
import AuthPage from "./pages/AuthPage";
import FeedPage from "./pages/FeedPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/duel" element={<Duel />} />
              <Route path="/play" element={<QuizGame />} />
              <Route path="/quiz" element={<QuizGame />} />
              <Route path="/game-mode" element={<GameMode />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
