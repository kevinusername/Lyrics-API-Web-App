/*
  This is a very simple example of a web front end for a publicly available web service.
  Due to its pedagogical nature, comments are more elaborate than they typically need to
  be, or may even be present when no developer explanation would usually be necessary.

  Further, this example uses JavaScript 2015 syntax.
*/

// Yes, this is a “global.” But it is a single entry point for all of the code in the module,
// and in its role as the overall controller code of the page, this is one of the acceptable
// uses for a [single!] top-level name.
//
// Module managers address even this issue, for web apps of sufficient complexity.
(() => {

  const setupEventListeners = () => {
    const searchButton = $('#search-button')
    const inputs = $('input[type=search]')
    let artist, track

    searchButton.click(() => {
      cleanUp()
      window.ApiService.searchLyrics(artist, track)
        .then(value => displayLyrics(value.result))
        .catch(() => {
          $('#main-col').prepend(
            $('<div></div>')
              .addClass('col alert alert-danger')
              .text('Sorry, no results were found for this search')
          )
          $('#tutorial').addClass('d-none')
        })
    })

    // Button disabled until both text inputs have content
    inputs.bind('input', () => {
      artist = $('#artist-name').val()
      track = $('#song-name').val()
      searchButton.prop('disabled', checkEmpty(artist, track))
    })

    // Can use enter key on either text input to submit query if inputs are not empty
    inputs.keydown(event => {
      if (event.keyCode === 13 && !checkEmpty(artist, track)) {
        searchButton.click()
        $('body').append($('<div id="stupid"></div>'))
      }
    })
  }

  const cleanUp = () => {
    let tutorial = $('#tutorial')
    $('.alert-danger').remove()
    tutorial.removeClass('d-none')
    tutorial.text('Loading results...')
  }

  // Set the youtube button onClick to the top video result (ordered by view count) for "[Artist] + [Song]" search
  const fillYTButton = (artist, track) => {
    window.ApiService.youtubeSearch(artist, track).then(result =>
      $('#yt-button')
        .off('click')
        .click(() => {
          window.open('https://www.youtube.com/watch?v=' + result.items[0].id.videoId)
        })
    )
  }

  // Set the Spotify button onClick to the top track result for "[Artist] + [Song]" search
  // Also displays the album art since the call result is already present
  const fillSpotifyButton = (artist, track) => {
    window.ApiService.spotifySearch(artist, track).then(result => {
      $('#spotify-button')
        .off('click')
        .click(() => window.open(result.tracks.items[0].external_urls.spotify))
      $('#album-art')
        .empty()
        .prepend('<img style="height:100px" src="' + result.tracks.items[0].album.images[1].url + '"/>')
      getRecommendations(result.tracks.items[0].artists[0].id, result.tracks.items[0].id)
    })
  }

  // Check to see if either of the text inputs are empty
  // Returns true if at least one input is empty
  const checkEmpty = (artist, track) => artist.length === 0 || track.length === 0

  // Displays the song's lyrics as well as header and button elements
  const displayLyrics = result => {
    const splitLyrics = result.track.text.split('\n')

    if (result.probability <= 50) {
      $('#main-col').prepend('<div class="alert alert-warning" role="alert">We aren\'t certain this is the corect song</div>')
    }

    // Make hidden elements visible and hide tutorial
    $('#tutorial').addClass('d-none')
    $('hr').removeClass('d-none')
    $('#button-container').removeClass('d-none')

    // Create header "[Song] by [Artist]"
    generateHeader(result.artist.name, result.track.name)

    // Occupy element with the lyrics, breaking at each new line
    let lyricsBody = $('#lyrics-body')
    lyricsBody.empty()
    for (let i = 0; i < splitLyrics.length; i++) {
      lyricsBody.append(splitLyrics[i] + '</br>')
    }

    // Using the Lyrics API's response fill in the other API's buttons
    fillYTButton(result.artist.name, result.track.name)
    fillSpotifyButton(result.artist.name, result.track.name)
  }

  const generateHeader = (artist, track) => {
    $('#track-info')
      .empty()
      .append('<h2 class="row" style="color:#FFE57F">' + track + '</h2>')
      .append('<h4 class="row"> by <span style="color:#FFD180; margin-left:4px"> ' + artist + '</span></h4>')
  }

  const getRecommendations = (artistSeed, trackSeed) => {
    window.ApiService.spotifyRecommendations(artistSeed, trackSeed).then(result => {
      $('#recommendations')
        .empty()
        .append($('<h3>Recommendations:</h3>'))
      for (let i = 0; i < result.tracks.length; i++) {
        $('#recommendations').append(
          $('<div></div>')
            .addClass('row')
            .attr('id', 'rec' + i)
            .attr('style', 'margin-top:5px')
            .append(
              $('<p></p>')
                .text(result.tracks[i].name)
                .addClass('col')
            )
            .click(() => {
              $('#artist-name').val(result.tracks[i].artists[0].name)
              $('#song-name')
                .val(result.tracks[i].name)
                .trigger('input')
              $('#search-button').click()
            })
            .prepend(
              $('<img>')
                .attr('src', result.tracks[i].album.images[1].url)
                .attr('style', 'height:50px')
                .addClass('col-auto')
            )
        )
      }
    })
  }

  const init = () => {
    setupEventListeners()
  }

  window.LyricSearchController = {
    init
  }
})()
