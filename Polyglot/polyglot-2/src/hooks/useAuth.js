import { createContext, useContext, useMemo, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [error, setError] = useState({
    status: false,
    message: ""
  })
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();

  // const sign up
  const register = useCallback(async (email, password, username)  => {

    setLoading(true);

    // get the date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = today.getFullYear();

    // the date that the user joined
    const joined = `${day}/${month}/${year}`;

    try {

      const user = await signUp(auth, email, password, username)

      // Wait for profile update
      await updateProfile(user, {
        displayName: username,
      });

      // Set user document in Firestore
      await setDoc(doc(firestore, "Users", user.uid), {
        Email: user.email,
        Username: username,
        Joined: joined,
        Perfects: 0,
        Tests: 0,
        Total_Words: 0,
        VocabLists: 0,
      });

      //  All done, now navigate
      navigate("/vocablists");

      setError(false);

    } catch (error) {
      console.error("Sign-up error:", error);

      setLoading(false);

      setError({
        status: true,
        message: "password must be stronger"
      })
    } finally {
      setLoading(false);
    }

  }, [auth, navigate])

  

  // call this function when you want to authenticate the user
  const login = useCallback( async ( email, password ) => {
    setLoading(true);

    try {
      console.log("signing in user:", email, password);

      await signIn(auth, email, password);
      
      navigate("/vocablists");

      setLoading(false);
      setError(false);

    } catch (error) {

      console.log("helloo")

      setError({
        status: true,
        message: error.message
      });
      
      console.error(error);
    } finally {
      setLoading(false)
    }
    
  },[auth, navigate]);

  // call this function to sign out logged in user
  const logout = useCallback(() => {
   signOut(auth).then(() => {
    // Sign-out successful.
    navigate("/", { replace: true });

    }).catch((error) => {
      // An error happened.
      console.error(error)
    });
    
  }, [auth, navigate]);

  // moniter authentication state
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log("User signed in:");
        setUser(user);
      } else {
        setUser(null);
      }

      setLoading(false)
    });


    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [user]); //? i added user as a dependancy but haven't checked if it affected anything

  // create object of values, which only update based on "user"
  const value = useMemo(
    () => ({
      user,
      register,
      login,
      logout,
      loading,
      error
    }),
    [user, register,
      login,
      logout,
      loading,
      error]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// password requires: caps, lowercase, special char, numbers

async function signUp(auth, email, password, username) {

  return createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {

    // Signed up

    return userCredential.user;;

  })
}


async function signIn(auth, email, password) {  
  return signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    return userCredential.user;
  })
}

