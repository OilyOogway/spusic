const express = require('express');
const path = require('path');
const app = express();
const Murl = "mongodb+srv://OilyOogway:Oilyasian@cluster0.tfq5hty.mongodb.net/?retryWrites=true&w=majority";
const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;

//Enable JSON parsing middleware
app.use(express.json());

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

app.post('/submitScore', async (req, res) => {
    const playerName = req.body.playerName;
    const score = parseInt(req.body.score, 10);

    console.log("we are in the post")
    console.log(`here is the current score ${score}`)
    // Validate player name and score
    if (!playerName || isNaN(score)) {
        res.status(400).json({ error: 'Invalid data format' });
        return;
    }
    console.log("we passed validation");

    try {
        // Connect to MongoDB and save the score
        const client = await MongoClient.connect(Murl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected to mongo");
        
        const dbo = client.db('Spusic');
        const collection = dbo.collection('highscore');

        // Use async/await for the insertOne operation
        const result = await collection.insertOne({ name: playerName, score: score });

        console.log('Score saved successfully');
        res.status(200).json({ message: 'Score saved successfully' });

        // Close the MongoDB connection
        client.close();
    } catch (error) {
        console.error('Error connecting to the database or saving score:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for getting the highest score
app.get('/getHighScore', async (req, res) => {
    try {
        const client = await MongoClient.connect(Murl, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbo = client.db('Spusic');
        const collection = dbo.collection('highscore');

        // Find the document with the highest score
        const result = await collection.find().sort({ score: -1 }).limit(1).toArray();

        if (result.length > 0) {
            const highScore = result[0].score;
            res.status(200).json({ highScore });
        } else {
            res.status(404).json({ error: 'No high score found' });
        }

        client.close();
    } catch (error) {
        console.error('Error connecting to the database or getting high score:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
