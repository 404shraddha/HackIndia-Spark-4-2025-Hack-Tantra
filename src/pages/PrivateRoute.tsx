import { Navigate } from "react-router-dom";

// ✅ Specify the type of children
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = localStorage.getItem("token"); // ✅ Auth check
  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
