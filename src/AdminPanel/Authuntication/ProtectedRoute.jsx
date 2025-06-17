import { Navigate, useParams } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { uid } = useParams();
  // Get user from localStorage (not cookies)
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    console.warn("No user found, redirecting to /Login");
    return <Navigate to="/Login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.warn(
      `User role "${user.role}" does not match required role "${requiredRole}", redirecting to /`
    );
    return <Navigate to="/" replace />;
  }

  // Optionally, check if uid matches user.secureUID
  if (uid && user.secureUID && uid !== user.secureUID) {
    console.warn("UID mismatch, redirecting to /Login");
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;
