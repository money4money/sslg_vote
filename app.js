import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getFirestore, doc, getDoc, collection, 
  addDoc, updateDoc, onSnapshot 
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

// Fixed Selector References
const positionSelectors = {
  president: '#presidentSelect',
  vicePresident: '#vicePresidentSelect',
  secretary: '#secretarySelect',
  treasurer: '#treasurerSelect',
  auditors: '#auditorsSelect',
  pio: '#pioSelect',
  protocolOfficer: '#protocolOfficerSelect'
};

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

      if (grade >= 7 && grade <= 11) {
        const nextGrade = parseInt(grade) + 1;
        const select = document.getElementById('gradeRepCandidate');
        select.innerHTML = '';
        
        gradeRepCandidates[nextGrade].forEach(candidate => {
          const option = document.createElement('option');
          option.value = candidate;
          option.textContent = candidate;
          select.appendChild(option);
        });

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

async function submitVote() {
  const lrn = document.getElementById('lrn').value.trim();
  const grade = document.getElementById('grade').value;

  // Fixed: Use explicit IDs instead of nth-child
  const votes = {
    president: document.querySelector(positionSelectors.president).value,
    vicePresident: document.querySelector(positionSelectors.vicePresident).value,
    secretary: document.querySelector(positionSelectors.secretary).value,
    treasurer: document.querySelector(positionSelectors.treasurer).value,
    auditors: document.querySelector(positionSelectors.auditors).value,
    pio: document.querySelector(positionSelectors.pio).value,
    protocolOfficer: document.querySelector(positionSelectors.protocolOfficer).value,
  };

  if (grade >= 7 && grade <= 11) {
    const nextGrade = parseInt(grade) + 1;
    const gradeRepValue = document.getElementById('gradeRepCandidate').value;
    if (gradeRepValue) votes[`grade${nextGrade}Rep`] = gradeRepValue;
  }

  try {
    await addDoc(collection(db, "votes"), {
      lrn: lrn,
      grade: parseInt(grade),
      votes: votes
    });

    await updateDoc(doc(db, "students", lrn), {
      hasVoted: true
    });
    alert("Vote submitted successfully!");
  } catch (error) {
    alert("Error submitting vote: " + error.message);
  }
}

function displayResults(voteData) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  const positions = [
    'president', 'vicePresident', 'secretary', 'treasurer',
    'auditors', 'pio', 'protocolOfficer',
    'grade8Rep', 'grade9Rep', 'grade10Rep', 'grade11Rep', 'grade12Rep'
  ];

  positions.forEach(position => {
    if (!voteData[position]) return;

    const candidates = Object.entries(voteData[position] || {})
      .sort((a, b) => b[1] - a[1]);

    const html = `
      <div class="result-card">
        <h3>${position.replace(/([A-Z])/g, ' $1').replace('Rep', ' Representative')}</h3>
        <ul>${candidates.map(([name, votes]) => `
          <li>${name}: ${votes} vote${votes !== 1 ? 's' : ''}</li>
        `).join('')}</ul>
        ${candidates.length > 0 ? `<h4>Leader: ${candidates[0][0]}</h4>` : ''}
      </div>
    `;
    resultsDiv.innerHTML += html;
  });

  document.getElementById('resultsSection').style.display = 'block';
}

function setupRealTimeResults() {
  onSnapshot(collection(db, 'votes'), (snapshot) => {
    const voteData = {};
    snapshot.forEach(doc => {
      const positions = doc.data().votes;
      Object.entries(positions).forEach(([position, candidate]) => {
        voteData[position] = voteData[position] || {};
        voteData[position][candidate] = (voteData[position][candidate] || 0) + 1;
      });
    });
    displayResults(voteData);
  });
}

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('voteBtn').addEventListener('click', submitVote);
setupRealTimeResults();
