import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, 
         signInWithPhoneNumber, RecaptchaVerifier, onAuthStateChanged,updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZ6GbHLTgjd8vFThwyYMuMq0WpCyoNtyY",
  authDomain: "amragate-b6824.firebaseapp.com",
  projectId: "amragate-b6824",
  storageBucket: "amragate-b6824.firebasestorage.app",
  messagingSenderId: "861436275631",
  appId: "1:861436275631:web:78ffc855b79930448fdd5a",
  measurementId: "G-ZW6B1Y7QHM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const registerWithEmailAndPassword = async (email, password,username) => {
  if (!email || !password) {
    console.error("Email and password must be provided.");
    throw new Error("Email and password are required.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username,
    });
    console.log("User registered with display name:", user.displayName);
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to Local");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Firebase functions

// Email/Password Sign-in
const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Google Sign-in
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    
    // If the user does not exist in Firestore, create the profile
    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        username: user.email.split('@')[0], // Use part before '@' as username
        createdAt: new Date(),
      });
      console.log("User profile created in Firestore");
    } else {
      console.log("User profile already exists in Firestore");
    }
    
    return user;
  } catch (error) {
    console.error("Google Sign-in error:", error);
    throw error;
  }
};



// Store user data in Firestore
const storeUserInFirestore = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: new Date(),
    };
    await setDoc(userRef, userData);  // Sets the user data to Firestore
    console.log("User data stored in Firestore");
  } catch (error) {
    console.error("Error storing user data in Firestore:", error);
    throw error;
  }
};
const verifyResetCode = async (oobCode) => {
  return await verifyPasswordResetCode(auth, oobCode);
  };
  
  // Updates the password
  const confirmReset = async (oobCode, newPassword) => {
  return await confirmPasswordReset(auth, oobCode, newPassword);
  };

export {
  auth,
  db,
  loginWithEmailAndPassword,
  signInWithGoogle,
  sendPasswordResetEmail ,
  verifyResetCode,
  confirmReset,
  storeUserInFirestore,
  registerWithEmailAndPassword,
};
