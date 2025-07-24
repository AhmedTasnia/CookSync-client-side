import React, {  useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import AuthContext from "./AuthContext";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const adminEmails = ["admin@gmail.com"]; // can add more if needed

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to set user with role
  const handleSetUser = (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    const role = adminEmails.includes(firebaseUser.email) ? "admin" : "user";
    // Pick needed user props and add role
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      role,
    });
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      handleSetUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create User (Sign Up)
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        handleSetUser(userCredential.user);
        setLoading(false);
        return userCredential;
      }
    );
  };

  // Update Profile
  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  // Sign In (Email/Password)
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        handleSetUser(userCredential.user);
        setLoading(false);
        return userCredential;
      }
    );
  };

  // Google Sign In
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider).then((result) => {
      handleSetUser(result.user);
      setLoading(false);
      return result;
    });
  };

  // Log Out
  const logOut = () => {
    setLoading(true);
    return signOut(auth).then(() => {
      setUser(null);
      setLoading(false);
    });
  };

  const authData = {
    user,
    loading,
    setUser,
    createUser,
    signIn,
    logOut,
    updateUser,
    googleSignIn,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

