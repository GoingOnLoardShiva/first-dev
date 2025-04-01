import { Navigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { uid } = useParams();
  const userCookie = Cookies.get("user");
  const userRole = Cookies.get("role");
  const user = userCookie ? JSON.parse(userCookie) : null;

  if (!user) {
    console.warn("No user found, redirecting to /Login");
    return <Navigate to="/Login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.warn(
      ` User role "${user.role}" does not match required role "${requiredRole}", redirecting to /`
    );
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
