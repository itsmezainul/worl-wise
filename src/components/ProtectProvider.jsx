import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/fakeAuthContext";
import { useEffect } from "react";

function ProtectProvider({ children }) {
  const navigate = useNavigate();
  const { isAuthorized } = useAuth();

  useEffect(
    function () {
      if (!isAuthorized) navigate("/");
    },
    [isAuthorized, navigate]
  );
  if (!isAuthorized) return null;
  return children;
}

export default ProtectProvider;
