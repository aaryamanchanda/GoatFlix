import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../utils/firebase";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  /* ── Listen for auth changes ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const adminEnv = import.meta.env.VITE_ADMIN_EMAIL || "";
        const adminEmail = adminEnv.replace(/['"]/g, "").trim().toLowerCase();
        const userEmail = firebaseUser.email?.toLowerCase() || "";
        const isAdmin = adminEmail && userEmail === adminEmail;
        // Check subscription status in Firestore
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (snap.exists()) {
            setSubscribed(snap.data().subscribed === true || isAdmin);
          } else {
            // First-time user — create document
            await setDoc(doc(db, "users", firebaseUser.uid), {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              subscribed: false,
              createdAt: new Date().toISOString(),
            });
            setSubscribed(isAdmin);
          }
        } catch (err) {
          console.error("Firestore read error:", err);
          setSubscribed(isAdmin); // Failsafe for admin
        }
      } else {
        setSubscribed(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  /* ── Auth helpers ── */
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return cred;
  };

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const logout = () => signOut(auth);

  /* ── Mark subscribed (called after successful payment) ── */
  const markSubscribed = async () => {
    if (!user) return;
    await setDoc(
      doc(db, "users", user.uid),
      { subscribed: true, subscribedAt: new Date().toISOString() },
      { merge: true }
    );
    setSubscribed(true);
  };

  const value = {
    user,
    loading,
    subscribed,
    login,
    signup,
    loginWithGoogle,
    logout,
    markSubscribed,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
