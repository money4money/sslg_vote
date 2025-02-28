import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, 
  addDoc, updateDoc, serverTimestamp 
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

    if (!/^\d{12}$/.test(lrn)) {
      alert("Invalid LRN! Must be 12 digits");
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
   
    async function loadResults() {
     try {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = "Loading results...";
    
       const votesSnapshot = await getDocs(collection(db, "votes"));
       const results = {};

    votesSnapshot.forEach(doc => {
      const voteData = doc.data().votes;
      Object.entries(voteData).forEach(([position, candidate]) => {
        if (!results[position]) results[position] = {};
        results[position][candidate] = (results[position][candidate] || 0) + 1;
      });
    });

    displayResults(results);
  } catch (error) {
    alert("Error loading results: " + error.message);
  }
}

function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  const positions = [
    'president', 'vicePresident', 'secretary', 'treasurer',
    'auditors', 'pio', 'protocolOfficer',
    'grade8Rep', 'grade9Rep', 'grade10Rep', 'grade11Rep', 'grade12Rep'
  ];

  positions.forEach(position => {
    if (!results[position]) return;

    const candidates = Object.entries(results[position])
      .sort((a, b) => b[1] - a[1]);

    const html = `
      <div class="result-card">
        <h3>${formatPositionName(position)}</h3>
        <ul>
          ${candidates.map(([name, votes]) => `
            <li>${name}: ${votes} vote${votes !== 1 ? 's' : ''}</li>
          `).join('')}
        </ul>
        ${candidates.length > 0 ? `
          <div class="leader">
            Current Leader: ${candidates[0][0]} (${candidates[0][1]} votes)
          </div>
        ` : ''}
      </div>
    `;
    resultsDiv.innerHTML += html;
  });
}

function formatPositionName(position) {
  return position
    .replace(/([A-Z])/g, ' $1')
    .replace('Rep', ' Representative')
    .replace(/^./, str => str.toUpperCase());
}

document.getElementById('showResults').addEventListener('click', () => {
  document.getElementById('resultsSection').style.display = 'block';
  loadResults();
});  
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
      alert("Login error: " + error.message);
    }
  }

  async function submitVote() {
    const lrn = lrnInput.value.trim();
    const grade = gradeSelect.value;

    try {
      const voteData = {
        lrn: lrn,
        grade: parseInt(grade),
        timestamp: serverTimestamp(),
        president: document.getElementById('presidentSelect').value,
        vicePresident: document.getElementById('vicePresidentSelect').value,
        secretary: document.getElementById('secretarySelect').value,
        treasurer: document.getElementById('treasurerSelect').value,
        auditors: document.getElementById('auditorsSelect').value,
        pio: document.getElementById('pioSelect').value,
        protocolOfficer: document.getElementById('protocolOfficerSelect').value
      };

      if (grade >= 7 && grade <= 11) {
        const nextGrade = parseInt(grade) + 1;
        voteData[`grade${nextGrade}Rep`] = gradeRepCandidate.value;
      }

      await addDoc(collection(db, "votes"), voteData);
      await updateDoc(doc(db, "students", lrn), { hasVoted: true });
      
      alert("Vote submitted successfully!");
      window.location.reload();
    } catch (error) {
      alert("Error submitting vote: " + error.message);
      console.error("Submission error:", error);
    }
  }

  loginBtn.addEventListener('click', login);
  voteBtn.addEventListener('click', submitVote);
});
