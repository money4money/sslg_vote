import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getFirestore, collection, onSnapshot 
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Real-time listener
onSnapshot(collection(db, "votes"), (snapshot) => {
  const results = {};
  
  // Initialize positions
  const positions = [
    'president', 'vicePresident', 'secretary', 
    'treasurer', 'auditors', 'pio', 
    'protocolOfficer', 'grade8Rep', 
    'grade9Rep', 'grade10Rep', 'grade11Rep', 
    'grade12Rep'
  ];

  positions.forEach(position => {
    results[position] = {};
  });

  snapshot.forEach(doc => {
    const voteData = doc.data().votes;
    Object.entries(voteData).forEach(([position, candidate]) => {
      results[position][candidate] = (results[position][candidate] || 0) + 1;
    });
  });

  displayResults(results);
});

function displayResults(results) {
  // Your results display logic here
}
