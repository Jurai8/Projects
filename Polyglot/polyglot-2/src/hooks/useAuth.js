import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const auth = getAuth();

  const [error, setError] = useState({
    status: false,
    message: ""
  })
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const sign up
  const register = ({ email, password, username}) => {

    setLoading(true);

    // get the date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = today.getFullYear();

    // the date that the user joined
    const joined = `${day}/${month}/${year}`;


    signUp(auth, email, password, username)
    .then(async (user) => {
      // ✅ Return and wait for updateProfile to finish
      return updateProfile(user, {
        displayName: username,
      }).then(() => {
        // ✅ Now set the doc with correct displayName
        return setDoc(doc(firestore, "Users", user.uid), {
          Email: user.email,
          Username: username,
          Joined: joined,
          Perfects: 0,
          Tests: 0,
          Total_Words: 0,
          VocabLists: 0,
        });
      });
    })
    .then(() => {
      // ✅ All done, now navigate
      setLoading(false);

      navigate("/vocablists");
    })
    .catch((error) => {
      console.error("Sign-up error:", error);

      setLoading(false);

      setError({
        status: true,
        message: "password must be stronger"
      })
    });
  };

  // call this function when you want to authenticate the user
  const login = ({ email, password }) => {
    try {
        console.log("signing in user");
        signIn(auth, email, password);

        navigate("/vocablists");
    } catch (error) {
        throw new Error("useAuth: login error");
    }
    
  };

  // call this function to sign out logged in user
  const logout = () => {
   signOut(auth).then(() => {
    // Sign-out successful.
    navigate("/", { replace: true });

    }).catch((error) => {
      // An error happened.
      console.error(error)
    });
    
  };

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
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// password requires: caps, lowercase, special char, numbers

function signUp(auth, email, password, username) {
  return createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {

    // Signed up

    return userCredential.user;;

  })
  .catch((error) => {
    console.error(error);
  });

}


function signIn(auth, email, password) {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    alert("Welcome");
  })
  .catch((error) => {
    console.error(error);
  });
}

