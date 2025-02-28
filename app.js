import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, 
  addDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDgxT2abVQ9IijpK7mPtSVR8MB9_avt5nY",
  authDomain: "smnhs-g-vote.firebaseapp.com",
  projectId: "smnhs-g-vote",
  storageBucket: "smnhs-g-vote.appspot.com",
  messagingSenderId: "416427442626",
  appId: "1:416427442626:web:4249dfb15d5892b144965b",
  measurementId: "G-RJHT21GX7Q"
};

const gradeRepCandidates = {
  8: ["Jonas Laude", "Kisha Pearl Landrito"],
  9: ["Tobey Marty Calamaya", "Dennise Agatha Herrero"],
  10: ["Angel Pelio", "Eunice Imee Lagarde"],
  11: ["Pia Mae Martija", "Loujane Bragas"],
  12: ["Angel Lloyd Bolante", "Bea Cleir Sister"]
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const voteBtn = document.getElementById('voteBtn');
  const lrnInput = document.getElementById('lrn');
  const gradeSelect = document.getElementById('grade');
  const gradeDisplay = document.getElementById('gradeDisplay');
  const gradeRepCandidate = document.getElementById('gradeRepCandidate');
  const gradeRepTitle = document.getElementById('gradeRepTitle');

  async function login() {
    const lrn = lrnInput.value.trim();
    const grade = gradeSelect.value;

    if (!lrn || !grade) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const docRef = doc(db, "students", lrn);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && !docSnap.data().hasVoted && docSnap.data().grade == grade) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('voteSection').style.display = 'block';
        gradeDisplay.textContent = grade;

        if (grade >= 7 && grade <= 11) {
          const nextGrade = parseInt(grade) + 1;
          gradeRepCandidate.innerHTML = '';
          
          gradeRepCandidates[nextGrade].forEach(candidate => {
            const option = document.createElement('option');
            option.value = candidate;
            option.textContent = candidate;
            gradeRepCandidate.appendChild(option);
          });

          gradeRepTitle.textContent = `Grade ${nextGrade} Representative`;
          document.getElementById('gradeRepSection').style.display = 'block';
        }
      } else {
        alert("Invalid LRN, grade mismatch, or already voted!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  async function submitVote() {
    const lrn = lrnInput.value.trim();
    const grade = gradeSelect.value;

    try {
      const votes = {
        president: document.getElementById('presidentSelect').value,
        vicePresident: document.getElementById('vicePresidentSelect').value,
        secretary: document.getElementById('secretarySelect').value,
        treasurer: document.getElementById('treasurerSelect').value,
        auditors: document.getElementById('auditorsSelect').value,
        pio: document.getElementById('pioSelect').value,
        protocolOfficer: document.getElementById('protocolOfficerSelect').value,
      };

      if (grade >= 7 && grade <= 11) {
        const nextGrade = parseInt(grade) + 1;
        votes[`grade${nextGrade}Rep`] = gradeRepCandidate.value;
      }

      // Add vote to votes collection
      await addDoc(collection(db, "votes"), {
        lrn: lrn,
        grade: parseInt(grade),
        votes: votes,
        timestamp: new Date()
      });

      // Update student's voting status
      await updateDoc(doc(db, "students", lrn), {
        hasVoted: true
      });

      alert("Vote submitted successfully!");
      window.location.reload(); // Reset the form

    } catch (error) {
      alert("Error submitting vote: " + error.message);
    }
  }

  loginBtn.addEventListener('click', login);
  voteBtn.addEventListener('click', submitVote);
});
