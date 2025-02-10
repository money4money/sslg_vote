// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration (replace with your own)
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

      // Show grade-level representative section
      if (grade >= 7 && grade <= 11) {
        const nextGrade = parseInt(grade) + 1;
        document.getElementById('gradeRepTitle').textContent = `Grade ${nextGrade} Representative`;
        document.getElementById('gradeRepSection').style.display = 'block';
      }
    } else {
      alert("Invalid LRN, grade mismatch, or already voted!");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Function to submit a vote
async function submitVote() {
  const lrn = document.getElementById('lrn').value.trim();
  const grade = document.getElementById('grade').value;

  // Collect votes for school-wide positions
  const votes = {
    president: document.querySelector('.position:nth-child(1) .candidate').value,
    vicePresident: document.querySelector('.position:nth-child(2) .candidate').value,
    secretary: document.querySelector('.position:nth-child(3) .candidate').value,
    treasurer: document.querySelector('.position:nth-child(4) .candidate').value,
    auditors: document.querySelector('.position:nth-child(5) .candidate').value,
    pio: document.querySelector('.position:nth-child(6) .candidate').value,
    protocolOfficer: document.querySelector('.position:nth-child(7) .candidate').value,
  };

  // Add grade-level representative vote if applicable
  if (grade >= 7 && grade <= 11) {
    const nextGrade = parseInt(grade) + 1;
    votes[`grade${nextGrade}Rep`] = document.getElementById('gradeRepCandidate').value;
  }

  try {
    // Add vote to Firestore
    await addDoc(collection(db, "votes"), {
      lrn: lrn,
      grade: parseInt(grade),
      votes: votes
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

// Attach event listeners
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('voteBtn').addEventListener('click', submitVote);
