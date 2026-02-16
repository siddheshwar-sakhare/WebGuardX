import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);
    window.location.href = "/dashboard";  //siddhu image error about navigae !!!!!!
  } else {
    window.location.href = "/login";
  }
}, []);


  return (
    <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Signing you in securely...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
