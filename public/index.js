var client_id = 'a41241959d87440a819279b03bacad2d';
var client_secret = '6a84941e44414903bc3dcf20606b73f5';
var token_url = 'https://accounts.spotify.com/api/token';
// Default playlist - Classic hits everyone should know
var playlist_url = 'https://api.spotify.com/v1/playlists/'
                   + '3HOj7HdL0TNKxcXZXgr7CG/tracks?market=US&limit=100';
var access_token = null;
var offset = 0;
var playlist = [];
var correctIndex = null;
var player = null;
var timer = null;
var score = 0;
const score_display = document.getElementById("score");

document.querySelectorAll('.play').forEach(play_button => {
    play_button.addEventListener("click", getSongs);
})
document.querySelectorAll('.track').forEach((track, index) => {
    track.addEventListener('click', () => {
        end = !check(index);
        if (!end) {
            setupGame();
        }
        else {
            endGame();
        }
    });
});
document.getElementById("back_to_start").addEventListener('click', () => {
    document.getElementById('start').hidden = false;
    document.getElementById('game_end').hidden = true;
})

function getSongs() {
    fetch(token_url, {
    method: 'POST',
    body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': client_id,
        'client_secret': client_secret
    })
    })
    .then(response => response.json())
    .then(data => getPlaylistTracks(data.access_token));
}

function getPlaylistTracks(token) {
    var input = document.getElementById('playlist').value;
    var match = input.match(/playlist\/([^?]+)/);
    playlist = [];

    if (match) {
        const playlist_id = match[1];
        playlist_url = "https://api.spotify.com/v1/playlists/" +
                       playlist_id + "/tracks?market=US&limit=100";
    }

    access_token = token;

    fetch(playlist_url, {
        headers: {
        'Authorization': 'Bearer ' + access_token,
        }
    })
    .then(response => response.json())
    .then(data => addToPlaylist(data))
    .catch(error => {
        var message = "Please enter a valid public Spotify playlist.";
        alert(message);
    });

}

function morePlaylistTracks() {
    fetch(playlist_url + '&offset=' + offset.toString(), {
        headers: {
        'Authorization': 'Bearer ' + access_token
        }
    })
    .then(response => response.json())
    .then(data => addToPlaylist(data));
}

function addToPlaylist(data) {
    offset += 100;

    var items = data.items;
    if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].track.preview_url) {
                playlist.push(items[i].track);
            }
        }
        morePlaylistTracks();
    }
    else {
        document.getElementById('start').hidden = true;
        document.getElementById('game_end').hidden = true;
        setupGame();
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setupGame() {
    // Randomly choose 4 songs from the playlist
    var duplicate = 1;
    const track_index = [];

    while (duplicate) {
        duplicate = 0;
        for (let i = 0; i < 4; i++) {
            track_index[i] = getRandomInt(playlist.length);
            for (let j = 0; j < i; j++) {
                if (track_index[i] == track_index[j])
                duplicate = 1;
            }
        }
    }

    // Populate song buttons
    var t = 0
    document.querySelectorAll('.track').forEach(
        track => {
        track.textContent = playlist[track_index[t]].name 
                    + ' by ' + playlist[track_index[t]].artists[0].name;
        t++;
    })

    // Show track buttons and score
    document.getElementById('tracks').hidden = false;
    //I added this
    document.getElementById('highscore').hidden = false;
    score_display.innerText = "Score: " + score;

    //Luke added this to get the highscore
    getHighScore();

    // Choose a random song to play
    correctIndex = getRandomInt(4);
    if (player == null) {
        player = new Audio(playlist[track_index[correctIndex]].preview_url);
    } else {
        player.pause();
        player.src = playlist[track_index[correctIndex]].preview_url;
    }
    if (timer != null)
        clearTimeout(timer);
    timer = setTimeout(endGame, 10000);
    player.play();
}

function check(indexClicked) {
    // Return true if correct and false otherwise
    if (indexClicked == correctIndex) {
        score++;
        score_display.innerText = "Score: " + score
        return true;
    }
    else {
        return false;
    }
}


function endGame() {
    // Cancel timer
    if (timer != null) {
        clearTimeout(timer);
    }

    player.pause();

    // Display game results
    document.getElementById('tracks').hidden = true;
    document.getElementById('game_end').hidden = false;
    document.getElementById('end_score').innerText = "Score: " + score;

    // Post the score to the server
    //Luke's note: fixed the score constantly being zero by posting before the score was reset
    postScore();
    // Reset score
    score = 0;

    
}
function postScore() {
    const playerName = prompt("Enter your name:");
    if (playerName) {
        const scoreData = {
            playerName: playerName,  // Corrected property name
            score: score
        };

        console.log('Submitting score:', scoreData);

        fetch('/submitScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scoreData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score submitted successfully:', data);
        })
        .catch(error => {
            console.error('Error submitting score:', error);
        });
    }
}

// Add this function to your existing JavaScript code
function getHighScore() {
    fetch('/getHighScore')
        .then(response => response.json())
        .then(data => {
            const highScoreElement = document.getElementById('highscore');
            highScoreElement.innerText = "High Score: " + data.highScore;
        })
        .catch(error => {
            console.error('Error getting high score:', error);
        });
}
