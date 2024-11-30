import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBv_rlFosusM4pmBKz9aTWuKeP1ZAHdhis",
  authDomain: "parmecy-center.firebaseapp.com",
  projectId: "parmecy-center",
  storageBucket: "parmecy-center.appspot.com",
  messagingSenderId: "829076238421",
  appId: "1:829076238421:web:a6a8cf41cebbbe9e6ba4dc",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in function
async function signIn(e) {
  e.preventDefault(); // Prevent the form from submitting

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email && password) {
    try {
      // Sign in the user with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");

      // Redirect to homepage or another page
      window.location.href = "index.html"; // Replace with your desired redirect page

      // Reset the form
      document.getElementById('loginForm').reset();
    } catch (error) {
      console.error("Error signing in:", error);
      alert(error.message);
    }
  } else {
    alert("Please fill in all fields.");
  }
}

// Add event listener to the form submit button
document.getElementById('loginForm').addEventListener('submit', signIn);
