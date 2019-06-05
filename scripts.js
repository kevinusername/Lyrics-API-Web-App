/* eslint-disable no-use-before-define */
function setupEventListeners() {
    const searchButton = $('#search-button');
    const inputs = $('input[type=search]');
    let artist;
    let track;

    searchButton.click(() => {
        cleanUp();
        searchLyrics(artist, track)
            .then(value => displayLyrics(value.result))
            .catch(() => {
                $('#main-col').prepend(
                    $('<div></div>')
                        .addClass('col alert alert-danger')
                        .text('Sorry, no results were found for this search'),
                );
                $('#tutorial').addClass('d-none');
            });
    });

    // Button disabled until both text inputs have content
    inputs.bind('input', () => {
        artist = $('#artist-name').val();
        track = $('#song-name').val();
        searchButton.prop('disabled', checkEmpty(artist, track));
    });

    // Can use enter key on either text input to submit query if inputs are not empty
    inputs.keydown((event) => {
        if (event.keyCode === 13 && !checkEmpty(artist, track)) {
            searchButton.click();
            $('body').append($('<div id="stupid"></div>'));
        }
    });
}

function cleanUp() {
    const tutorial = $('#tutorial');
    $('.alert-danger').remove();
    tutorial.removeClass('d-none');
    tutorial.text('Loading results...');
}


// Set the youtube button onClick to the top video result (ordered by view count) for "[Artist] + [Song]" search
function fillYTButton(artist, track) {
    youtubeSearch(artist, track).then(result => $('#yt-button')
        .off('click')
        .click(() => window.open(`https://www.youtube.com/watch?v=${result.items[0].id.videoId}`)));
}

// Set the Spotify button onClick to the top track result for "[Artist] + [Song]" search
// Also displays the album art since the call result is already present
function fillSpotifyButton(artist, track) {
    spotifySearch(artist, track)
        .then((result) => {
            $('#spotify-button')
                .off('click')
                .click(() => window.open(result.tracks.items[0].external_urls.spotify));

            $('#album-art')
                .empty()
                .prepend(`<img style="height:100px" src="${result.tracks.items[0].album.images[1].url}"/>`);

            getRecommendations(result.tracks.items[0].artists[0].id, result.tracks.items[0].id);
        })
        .catch(error => $('#main-col').prepend(
            `<div class="alert alert-warning" role="alert">Unable to receive Spotify data. ${error} </div>`,
        ));
}

// Check to see if either of the text inputs are empty
// Returns true if at least one input is empty
function checkEmpty(artist, track) { return artist.length === 0 || track.length === 0; }


// Displays the song's lyrics as well as header and button elements
function displayLyrics(result) {
    const splitLyrics = result.track.text.split('\n');
    const artistName = result.artist.name;
    const trackName = result.track.name;


    if (result.probability <= 50) {
        $('#main-col').prepend(
            '<div class="alert alert-warning" role="alert">We aren\'t certain this is the correct song</div>',
        );
    }

    // Make hidden elements visible and hide tutorial
    $('#tutorial').addClass('d-none');
    $('hr').removeClass('d-none');
    $('#button-container').removeClass('d-none');

    // Create header "[Song] by [Artist]"
    generateHeader(artistName, trackName);

    // Occupy element with the lyrics, breaking at each new line
    const lyricsBody = $('#lyrics-body');
    lyricsBody.empty();
    splitLyrics.forEach(line => lyricsBody.append(`${line}</br>`));

    // Using the Lyrics API's response fill in the other API's buttons
    fillYTButton(artistName, trackName);
    fillSpotifyButton(artistName, trackName);
}

function generateHeader(artist, track) {
    $('#track-info')
        .empty()
        .append(`<h2 class="row" style="color:#FFE57F">${track}</h2>`)
        .append(
            `<h4 class="row"> by <span style="color:#FFD180; margin-left:4px"> ${artist}</span></h4>`,
        );
}

function getRecommendations(artistSeed, trackSeed) {
    spotifyRecommendations(artistSeed, trackSeed).then((result) => {
        const $recommendations = $('#recommendations');

        $recommendations
            .empty()
            .append($('<h3>Recommendations:</h3>'));
        result.tracks.forEach((track, i) => $recommendations.append(recTemplate(track, i)));
    });

    function recTemplate(track, i) {
        return $('<div></div>')
            .addClass('row')
            .attr('id', `rec${i}`)
            .attr('style', 'margin-top:5px')
            .append($('<p>').text(track.name))
            .click(() => {
                $('#artist-name').val(track.artists[0].name);
                $('#song-name')
                    .val(track.name)
                    .trigger('input');
                $('#search-button').click();
            })
            .prepend(
                $('<img>')
                    .attr('src', track.album.images[1].url)
                    .attr('style', 'height:50px')
                    .addClass('col-auto'),
            );
    }
}

// These shouldn't be here, but I would need a server for this otherwise.
const spotifyToken = 'BQDTJkbhY7kbF0e1KpRvf9UI9F7xVL3928MOB8lM1xDRr3tYX48nXE6Skg9nRlgg9clKvNLtWHNrRTGmgn0';
const youtubeKey = 'AIzaSyAfMRljYNN6yDhCS7fmhbC46mfw9rQFE7g';
const lyricsKey = 'jZTFcQIDm9bSctMHnFHDW3r0VMWGq55RucTyD4iWiYVip6thmqI1hfiQ1Z7xLxFU';

async function searchLyrics(artist, track) {
    artist = artist.trim().replace(' ', '+');
    track = track.trim().replace(' ', '+');
    const fetchString = `https://orion.apiseeds.com/api/music/lyric/${artist}/${track}?apikey=${lyricsKey}`;
    return fetch(fetchString)
        .then((response) => {
            if (response.ok) return response.json();
            throw Error();
        });
}


// Actual response of Youtube API searching for sample song
async function youtubeSearch(artist, track) {
    artist = artist.trim().replace(' ', '+');
    track = track.trim().replace(' ', '+');
    const fetchString = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=${artist}${track}&key=${youtubeKey}`;
    const response = await fetch(fetchString);
    return response.json();
}


// Actual response of Spotify API searching for sample song
async function spotifySearch(artist, track) {
    artist = artist.trim().replace(' ', '+');
    track = track.trim().replace(' ', '+');
    const fetchString = `https://api.spotify.com/v1/search?query=track:${track}+artist:${artist}&type=track&market=US&offset=0&limit=1`;
    return fetch(fetchString, { headers: { Authorization: `Bearer ${spotifyToken}` } })
        .then((response) => {
            if (response.ok) return response.json();
            throw Error('Bad response from Spotify. Likely need to regenerate key.');
        });
}


async function spotifyRecommendations(artistSeed, trackSeed) {
    const fetchString = `https://api.spotify.com/v1/recommendations?limit=3&market=US&seed_artists=${artistSeed}&seed_tracks=${trackSeed}`;
    const response = await fetch(fetchString, { headers: { Authorization: `Bearer ${spotifyToken}` } });
    return response.json();
}

setupEventListeners();
