import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Learner } from "../functions/Learner";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const auth = getAuth();

  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // const sign up
  const register = ({ email, password, username}) => {
    try {
      signUp(auth, email, password, username);

       navigate("/vocablists");
    } catch (error) {
      alert("could not create account")
      throw new Error("useAuth: register error");
    }
   
  }

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

  console.log(email, password, username);

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;

    // update username
    updateProfile(user, {
      displayName: username
    })


  })
  .catch((error) => {
    console.error(error);
  });

  // TODO updated db with user credentials
  const upadteDb = async (user) => {
    await setDoc(user.uid, {
      Email: user.email,
      Username: user.displayName
    })
  }

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

