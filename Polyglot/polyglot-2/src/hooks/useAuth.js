import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Learner } from "../functions/Learner";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();


// TODO: create loading state
export const AuthProvider = ({ children }) => {
  const learner = new Learner();

  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // const sign up
  const register = async ({ email, password, username}) => {
    try {
      await learner.SignUp(email, password, username)
    } catch (error) {
      alert("could not create account")
      throw new Error("useAuth: register error");
    }
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
    navigate("/vocablists");
  };

  // call this function to sign out logged in user
  const logout = () => {
    try {
      learner.SignOut();
  } catch (error) {
    throw new Error("useAuth: sign out error");

  }
    navigate("/", { replace: true });
  };

  // moniter authentication state
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("User signed in:", user);
        setUser(user);
      } else {
        setUser(null);
      }

      setLoading(false)
    });


    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // context value
  const value = useMemo(
    () => ({
      user,
      register,
      login,
      logout,
      loading,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
