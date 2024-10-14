import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3uwWrikKbDhw1lJ70oy4ol7bRPzsdoGE",
  authDomain: "nwitter-reloaded-121ae.firebaseapp.com",
  projectId: "nwitter-reloaded-121ae",
  storageBucket: "nwitter-reloaded-121ae.appspot.com",
  messagingSenderId: "10436300250",
  appId: "1:10436300250:web:e15ab1664c1a96f02bc4e3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);