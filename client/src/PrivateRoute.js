// import { Outlet } from "react-router-dom";
// import Dny from "./components/List/Dny";
// import { useState } from "react";

import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ isLogged }) {
  return isLogged ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;

// const ProtectedRoutes = (props) => {
//   const [loggedIn, setLoggedIn] = useState();

//   return loggedIn ? (
//     <Dny data={props.data} />
//   ) : (
//     <Login setLoggedIn={setLoggedIn} />
//   );
// };

// export default ProtectedRoutes;
