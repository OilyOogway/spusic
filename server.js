const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = 8000;

http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  const pathName = urlObj.pathname;

  console.log('Requested path:', pathName);

  if (pathName === '/') {
    serveStaticFile(res, 'spusic.html');
  } else if (pathName === '/index.js') {
    serveStaticFile(res, 'index.js', 'text/javascript');
  } else if (pathName === '/style.css') {
    serveStaticFile(res, 'style.css', 'text/css');
  } else if (pathName === "/process") {
    // Implement your process logic here
    // ...
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Serve static files
function serveStaticFile(res, fileName, contentType = 'text/html') {
  const filePath = path.join(__dirname, 'public', fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file '${fileName}':`, err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}






// // MongoDB connection details
// const Murl = "mongodb+srv://OilyOogway:Oilyasian@cluster0.tfq5hty.mongodb.net/?retryWrites=true&w=majority";
// const http = require('http');
// const url = require('url');
// const MongoClient = require('mongodb').MongoClient;
// const express = require('express');
// const bodyParser = require('body-parser');
// const dbName = 'Spusic';
// const collectionName = 'highscore';

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware to parse JSON requests
// app.use(bodyParser.json());


// // Serve static files from the 'public' folder
// app.use(express.static('public'));

// // Route for the main page
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'spusic.html'));
//   });

// // Endpoint to submit a high score
// app.post('/highscores', async (req, res) => {
//   const { name, score } = req.body;

//   try {
//     const client = await MongoClient.connect(Murl, { useNewUrlParser: true, useUnifiedTopology: true });
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);

//     await collection.insertOne({ name, score });

//     res.status(201).json({ success: true });
//   } catch (error) {
//     console.error('Error inserting high score:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });

// // Endpoint to get high scores
// app.get('/highscores', async (req, res) => {
//   try {
//     const client = await MongoClient.connect(Murl, { useNewUrlParser: true, useUnifiedTopology: true });
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);
//     console.log("we connected!")

//     const highScores = await collection.find().sort({ score: -1 }).limit(10).toArray();

//     res.status(200).json(highScores);
//   } catch (error) {
//     console.error('Error retrieving high scores:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

