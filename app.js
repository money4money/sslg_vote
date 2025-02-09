// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgxT2abVQ9IijpK7mPtSVR8MB9_avt5nY",
  authDomain: "smnhs-g-vote.firebaseapp.com",
  projectId: "smnhs-g-vote",
  storageBucket: "smnhs-g-vote.appspot.com",
  messagingSenderId: "416427442626",
  appId: "1:416427442626:web:4249dfb15d5892b144965b",
  measurementId: "G-RJHT21GX7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Function to log in a student using LRN
async function login() {
  const lrn = document.getElementById('lrn').value.trim();
  const grade = document.getElementById('grade').value;

  try {
    const docRef = doc(db, "students", lrn);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && !docSnap.data().hasVoted && docSnap.data().grade == grade) {
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('voteSection').style.display = 'block';
      document.getElementById('gradeDisplay').textContent = grade;
    } else {
      alert("Invalid LRN, grade mismatch, or already voted!");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Function to submit a vote
async function submitVote() {
  const candidate = document.getElementById('candidates').value;
  const grade = document.getElementById('grade').value;
  const lrn = document.getElementById('lrn').value.trim();

  try {
    // Add vote to Firestore
    await addDoc(collection(db, "votes"), {
      candidate: candidate,
      grade: parseInt(grade),
      timestamp: new Date()
    });

    // Mark student as "hasVoted"
    await updateDoc(doc(db, "students", lrn), {
      hasVoted: true
    });

    alert("Vote submitted!");
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Attach functions to the global window object
window.login = login;
window.submitVote = submitVote;
