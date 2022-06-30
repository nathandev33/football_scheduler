import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router";
// import App from "./App";

function PrivateRoute({ isLogged }) {
  const location = useLocation();
  return isLogged ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
}

export default PrivateRoute;
