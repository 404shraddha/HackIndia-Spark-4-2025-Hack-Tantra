import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
