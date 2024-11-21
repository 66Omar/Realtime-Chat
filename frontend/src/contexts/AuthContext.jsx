import { createContext, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
  const [user, setUser] = useState();
  const queryClient = useQueryClient();

  const logoutUser = (force = false) => {
    localStorage.removeItem("userToken");
    setToken(null);
    setUser(null);
    if (force) {
      toast("Your session has expired. Please login again.");
    }
    queryClient.clear();
  };

  let contextData = {
    user,
    setUser,
    token,
    setToken,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
