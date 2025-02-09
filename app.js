// Firebase configuration (replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentLRN = "";

function login() {
  const lrn = document.getElementById('lrn').value.trim();
  const grade = document.getElementById('grade').value;
  currentLRN = lrn;

  // Check if LRN exists and hasn't voted
  db.collection('students').doc(lrn).get().then((doc) => {
    if (doc.exists && !doc.data().hasVoted && doc.data().grade == grade) {
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('voteSection').style.display = 'block';
      document.getElementById('gradeDisplay').textContent = grade;
    } else {
      alert("Invalid LRN, grade mismatch, or already voted!");
    }
  }).catch((error) => {
    alert("Error: " + error.message);
  });
}

function submitVote() {
  const candidate = document.getElementById('candidates').value;
  const grade = document.getElementById('grade').value;

  // Add vote to Firestore
  db.collection('votes').add({
    candidate: candidate,
    grade: parseInt(grade),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    // Mark student as "hasVoted"
    db.collection('students').doc(currentLRN).update({
      hasVoted: true
    });
    alert("Vote submitted!");
  }).catch((error) => {
    alert("Error: " + error.message);
  });
}
