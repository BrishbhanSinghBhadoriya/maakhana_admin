import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";   

const firebaseConfig = {
  apiKey: "AIzaSyAcUtHSxsz3DUdX2uYCy9id7p3RSMv811w",
  authDomain: "maakhana-admin.firebaseapp.com",
  projectId: "maakhana-admin",
  storageBucket: "maakhana-admin.firebasestorage.app",
  messagingSenderId: "469709218597",
  appId: "1:469709218597:web:8f7f76157bcf04149770cc",
  measurementId: "G-NSDKFW5RF9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);  
