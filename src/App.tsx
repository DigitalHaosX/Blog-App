import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import LiquidBackground from "./components/LiquidBackground";
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./pages/Home";
import ArticleDetails from "./pages/ArticleDetails";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gift from "./pages/Gift";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <LiquidBackground />
      <AppNavbar />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/article/:id" element={<ArticleDetails />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateArticle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditArticle />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gift" element={<Gift />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
