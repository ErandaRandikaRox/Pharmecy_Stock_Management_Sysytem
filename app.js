import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBv_rlFosusM4pmBKz9aTWuKeP1ZAHdhis",
  authDomain: "parmecy-center.firebaseapp.com",
  projectId: "parmecy-center",
  storageBucket: "parmecy-center.appspot.com",
  messagingSenderId: "829076238421",
  appId: "1:829076238421:web:a6a8cf41cebbbe9e6ba4dc",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const stockCollection = collection(db, "stock");

// Local variable to store stock data
let localStockData = [];

// Function to Fetch Data from Firebase and Store it Locally
async function fetchStockData() {
  try {
    const querySnapshot = await getDocs(stockCollection);
    localStockData = []; // Reset local data
    querySnapshot.forEach((doc) => {
      const stock = { id: doc.id, ...doc.data() };
      localStockData.push(stock);
    });
    displayStock(); // Refresh the display after fetching
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
}

// Function to Add Stock Locally and Sync with Firebase
async function addStock() {
  const name = document.getElementById("name").value.trim();
  const quantity = parseInt(document.getElementById("quantity").value);

  if (name && quantity >= 0) {
    const newStock = { name, quantity };
    localStockData.push(newStock); // Add locally

    try {
      await addDoc(stockCollection, newStock); // Sync with Firebase
      alert("Stock added successfully!");
      document.getElementById("name").value = "";
      document.getElementById("quantity").value = "";
      displayStock(); // Refresh stock display
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Failed to add stock. Please try again.");
    }
  } else {
    alert("Please enter valid stock details.");
  }
}

// Function to Display Stock from Local Variable
function displayStock(queryFilter = "") {
  const stockTable = document.getElementById("stockTable");
  stockTable.innerHTML = ""; // Clear table before populating

  const filteredData = queryFilter
    ? localStockData.filter((stock) => stock.name.toLowerCase().includes(queryFilter.toLowerCase()))
    : localStockData;

  filteredData.forEach((stock) => {
    stockTable.innerHTML += `
      <tr data-id="${stock.id}">
        <td>${stock.name}</td>
        <td>${stock.quantity}</td>
        <td>
          <button class="delete-button">Delete</button>
          <button class="update-button">Update</button>
        </td>
      </tr>
    `;
  });
}

// Function to Filter Out of Stock Items from Local Data
function filterOutOfStock() {
  const stockTable = document.getElementById("stockTable");
  stockTable.innerHTML = ""; // Clear table before populating

  const outOfStockItems = localStockData.filter(stock => stock.quantity === 0);
  outOfStockItems.forEach((stock) => {
    stockTable.innerHTML += `
      <tr data-id="${stock.id}">
        <td>${stock.name}</td>
        <td>${stock.quantity}</td>
        <td>
          <button class="delete-button">Delete</button>
          <button class="update-button">Update</button>
        </td>
      </tr>
    `;
  });
}

// Event Delegation for Delete and Update Buttons
document.getElementById("stockTable").addEventListener("click", async (e) => {
  const row = e.target.closest("tr");
  const id = row?.dataset.id;

  if (e.target.classList.contains("delete-button")) {
    if (id) {
      try {
        // Remove from local data
        localStockData = localStockData.filter(stock => stock.id !== id);

        // Sync with Firebase
        await deleteDoc(doc(db, "stock", id));
        alert("Stock deleted successfully!");
        displayStock(); // Refresh stock display after deletion
      } catch (error) {
        console.error("Error deleting stock:", error);
        alert("Failed to delete stock.");
      }
    }
  } else if (e.target.classList.contains("update-button")) {
    if (id) {
      const stock = localStockData.find(stock => stock.id === id);
      const newQuantity = prompt(`Update quantity for ${stock.name}:`, stock.quantity);

      if (newQuantity && parseInt(newQuantity) >= 0) {
        stock.quantity = parseInt(newQuantity); // Update locally

        try {
          // Sync with Firebase
          await updateDoc(doc(db, "stock", id), { quantity: stock.quantity });
          alert("Stock updated successfully!");
          displayStock(); // Refresh stock display after update
        } catch (error) {
          console.error("Error updating stock:", error);
          alert("Failed to update stock.");
        }
      } else {
        alert("Invalid input. Please try again.");
      }
    }
  }
});

// Event Listener for Add Stock Button
document.getElementById("addStockButton").addEventListener("click", addStock);

// Event Listener for Search Bar
document.getElementById("searchBar").addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim().toLowerCase(); // Ensure lowercase search
  displayStock(searchTerm); // Apply search filter without blocking button functionality
});

// Event Listener for Filter Out of Stock Button
document.getElementById("filterOutOfStockButton").addEventListener("click", filterOutOfStock);

// Load Stock Data on Page Load
document.addEventListener("DOMContentLoaded", fetchStockData);
