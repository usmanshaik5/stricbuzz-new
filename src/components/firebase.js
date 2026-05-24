import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB7H6lFDi-KlaZo2YUyWlKxEy8bXtnwFWQ",
  authDomain: "stricbuzz.firebaseapp.com",
  projectId: "stricbuzz",
  storageBucket: "stricbuzz.firebasestorage.app",
  messagingSenderId: "1068088981529",
  appId: "1:1068088981529:web:58c0bb2ad7402490b45288",
  measurementId: "G-H13V5JFGDL",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

async function writePointsTable(data, docId) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!user.email || !user.email.match(/.*@gmail\.com$/)) {
    throw new Error("User email is not a gmail address");
  }

  const docRef = doc(db, "pointsTable", docId);

  await setDoc(docRef, data);
}

async function exampleWrite() {
  try {
    const user = await getCurrentUser();

    if (user && user.email.match(/.*@gmail\.com$/)) {
      await writePointsTable({ points: 100 }, "user_points");

      console.log("Write successful");
    } else {
      console.error("User not authenticated or invalid email");
    }
  } catch (error) {
    console.error("Error during write operation:", error);
  }
}

export { db, app, auth, analytics, getCurrentUser, writePointsTable, exampleWrite };