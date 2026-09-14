import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { apiRequest } from "../../lib/api";

const ProtectedRoute = () => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    apiRequest("/auth/me")
      .then(() => {
        if (active) setStatus("authenticated");
      })
      .catch(() => {
        sessionStorage.removeItem("crm-authenticated");
        if (active) setStatus("anonymous");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return <div className="loading-state"><span className="loader" /><p>Checking your session...</p></div>;
  }

  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
