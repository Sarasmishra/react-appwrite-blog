import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, authChecked } = useSelector(
    (state) => state.auth
  );

  // ⏳ Wait until auth check finishes
  if (!authChecked) {
    return null; // or loader
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
