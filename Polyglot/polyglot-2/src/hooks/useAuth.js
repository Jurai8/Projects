import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { Learner } from "../functions/Learner";


const AuthContext = createContext();
const learner = new Learner();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", false);
  const navigate = useNavigate();

  // TODO complete sign up
  // const sign up
  
  // call this function when you want to authenticate the user
  const login = async ({ email, password }) => {

    try {
        console.log("signing in user");
        await learner.LogIn(email, password);
    } catch (error) {
        alert("failed to login");
        return 0; 
    }

    setUser(email);
    navigate("/vocablists");
  };

  // call this function to sign out logged in user
  const logout = () => {

    try {
      learner.SignOut();
  } catch (error) {
      alert("failed to sign out");
      return 0; 
  }
    setUser(false);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
