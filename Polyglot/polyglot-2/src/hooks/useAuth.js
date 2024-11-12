import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Learner } from "../functions/Learner";
import { useLocalStorage } from "./useLocalStorage";


const AuthContext = createContext();
const learner = new Learner();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", false);
  const navigate = useNavigate();

  // const sign up
  const register = async ({ email, password, username}) => {
    try {
      await learner.SignUp(email, password, username)
    } catch (error) {
      alert("could not create account")
      throw new Error("useAuth: register error");
      
    }

    setUser(email);
    navigate("/vocablists");
  }

  // call this function when you want to authenticate the user
  const login = async ({ email, password }) => {
    try {
        console.log("signing in user");
        await learner.LogIn(email, password);
    } catch (error) {
        throw new Error("useAuth: login error");
    }

    setUser(email);
    navigate("/vocablists");
  };

  // call this function to sign out logged in user
  const logout = () => {

    try {
      learner.SignOut();
  } catch (error) {
    throw new Error("useAuth: sign out error");

  }
    setUser(false);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      register,
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
