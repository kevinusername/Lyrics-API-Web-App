/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

const request = require('request') // "Request" library

const clientId = '5c8ab66476fc4a0fb1a489849348646b' // Your client id
const clientSecret = '6bb2d3e5a8304981adcf3d3a72dea436' // Your secret

// your application requests authorization
const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
}

request.post(authOptions, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    // use the access token to access the Spotify Web API
    const token = body.access_token
    console.log(token)
  }
})
