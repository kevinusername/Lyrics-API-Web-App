// When starting a front end, it is usual to first separate out the functions which will be implemented by
// a web service. This module demonstrates how such a “mock” service can look. Note how the external interface
// of the final ApiService object matches the one in api.js. That’s because, in reality, this file is actually
// how api.js _starts_, and it morphs into the final api.js when you connect to the web service for real.

(() => {
  // Actual response of APISeeds Lyrics API searching for sample song

  // Must be regenerated every hour by running node app.js and pasting the key here
  // Not sure if there is a better way to do this without excessive effort/libraries
  const spotifyToken = 'BQD2CRrscMA4HI-zh-ZRnaUDpxu6E3l26FofkxDrRL61zYDK1ivAYYLdhb5rJojp4sxDkCBPXpnGKhfzAEM'
  const youtubeKey = 'AIzaSyAfMRljYNN6yDhCS7fmhbC46mfw9rQFE7g'
  const lyricsKey = 'jZTFcQIDm9bSctMHnFHDW3r0VMWGq55RucTyD4iWiYVip6thmqI1hfiQ1Z7xLxFU'

  const searchLyrics = (artist, track) => {
    artist = artist.trim().replace(' ', '+')
    track = track.trim().replace(' ', '+')
    let fetchString = 'https://orion.apiseeds.com/api/music/lyric/' + artist + '/' + track + '?apikey=' + lyricsKey

    return fetch(fetchString).then(response => response.json())
  }

  // Actual response of Youtube API searching for sample song
  const youtubeSearch = (artist, track) => {
    artist = artist.trim().replace(' ', '+')
    track = track.trim().replace(' ', '+')
    let fetchString =
      'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=' +
      artist +
      track +
      '&key=' +
      youtubeKey
    return fetch(fetchString).then(response => response.json())
  }

  // Actual response of Spotify API searching for sample song
  const spotifySearch = (artist, track) => {
    artist = artist.trim().replace(' ', '+')
    track = track.trim().replace(' ', '+')
    let fetchString =
      'https://api.spotify.com/v1/search?query=track:' + track + '+artist:' + artist + '&type=track&market=US&offset=0&limit=1'

    return fetch(fetchString, {
      headers: {
        Authorization: 'Bearer ' + spotifyToken
      }
    }).then(response => response.json())
  }

  const spotifyRecommendations = (artistSeed, trackSeed) => {
    let fetchString =
      'https://api.spotify.com/v1/recommendations?limit=3&market=US&seed_artists=' + artistSeed + '&seed_tracks=' + trackSeed
    return fetch(fetchString, {
      headers: {
        Authorization: 'Bearer ' + spotifyToken
      }
    }).then(response => response.json())
  }

  window.ApiService = {
    searchLyrics,
    youtubeSearch,
    spotifySearch,
    spotifyRecommendations
  }
})()
