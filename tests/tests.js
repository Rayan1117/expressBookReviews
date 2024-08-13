// general.js
const axios = require('axios');

// Function to get the list of books
async function getBookList() {
    try {
        const response = await axios.get('http://localhost:5000/'); // Adjust the URL to match your Express server endpoint
        console.log('Book List:', response.data);
    } catch (error) {
        console.error('Error fetching book list:', error.message);
    }
}

// Execute the function
getBookList();
