const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'spusic.html'));
});

// Route for serving index.js
app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.js'));
});

// Route for serving style.css
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

// Implement your process logic here
app.post('/process', (req, res) => {
  // Implement your process logic here
  // ...
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});


// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

