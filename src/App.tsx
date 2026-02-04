import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Chat from "./components/Chat";
import Friends from "./components/Friends";
import Duel from "./components/Duel";
import Quiz from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/duel" element={<Duel />} />
            <Route path="/play" element={<Quiz />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
