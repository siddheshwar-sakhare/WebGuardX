import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./auth/OAuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import ZapScan from "./pages/ZapScan";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/zap-scan"
  element={
    <ProtectedRoute>
      <ZapScan />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
