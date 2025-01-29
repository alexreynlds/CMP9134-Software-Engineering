import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWIUEdE1hwVLhmV3KdpjCcac2bYoOG4ME",
  authDomain: "software-engineering-f862a.firebaseapp.com",
  projectId: "software-engineering-f862a",
  storageBucket: "software-engineering-f862a.firebasestorage.app",
  messagingSenderId: "1037817438226",
  appId: "1:1037817438226:web:2aad83c49d3f2eb54038cb",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
