// YouTube API video uploader using JavaScript/Node.js
// You can find the full visual guide at: https://www.youtube.com/watch?v=gncPwSEzq1s
// You can find the brief written guide at: https://quanticdev.com/articles/automating-my-youtube-uploads-using-nodejs
//
// Upload code is adapted from: https://developers.google.com/youtube/v3/quickstart/nodejs

const fs = require('fs');
const readline = require('readline');
const assert = require('assert')
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// video category IDs for YouTube:
const categoryIds = {
  Entertainment: 24,
  Education: 27,
  ScienceTechnology: 28
}

// If modifying these scopes, delete your previously saved credentials in client_oauth_token.json
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
let TOKEN_PATH = './' + 'client_oauth_token.json';

let videoFilePath = null;
const thumbFilePath = null;

exports.uploadVideoToYoutube = (video_path, title, description, tags, client_secret, token_path) => {

  console.log(" inside uploadVideoToYoutube func /// ")
  videoFilePath = video_path;
  assert(fs.existsSync(videoFilePath))
  //assert(fs.existsSync(thumbFilePath))
  TOKEN_PATH = token_path;
  // Load client secrets from a local file.
  fs.readFile(client_secret, function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), (auth) => uploadVideo(auth, title, description, tags));
  });
}

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function uploadVideo(auth, title, description, tags) {
  const service = google.youtube('v3')
  console.log(" inside uploadVideo func /// ")

  service.videos.insert({
    // timeout: 10000,
    auth: auth,
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title : title,
        description : description,
        tags : tags,
        categoryId: categoryIds.ScienceTechnology,
        defaultLanguage: 'en',
        defaultAudioLanguage: 'en'
      },
      status: {
        privacyStatus: "public"
      },
    },
    media: {
      body: fs.createReadStream(videoFilePath),
    },
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log(response.data)
    let uploaded_video_data = response.data;
    console.log('Video uploaded.')
    // console.log('Uploading the thumbnail now.')
    // service.thumbnails.set({
    //   auth: auth,
    //   videoId: response.data.id,
    //   media: {
    //     body: fs.createReadStream(thumbFilePath)
    //   },
    // }, function(err, response) {
    //   if (err) {
    //     console.log('The API returned an error: ' + err);
    //     return;
    //   }
    //   console.log(response.data)
    // })
  });
  
  // console.log("UPLOAD OBJ : ", req);
  // var fileSize = fs.statSync(videoFilePath).size;

  //   // show some progress
  // var id = setInterval(function() {
  //     var uploadedBytes = req.req.connection._bytesDispatched;
  //     var uploadedMBytes = uploadedBytes / 1000000;
  //     var progress = uploadedBytes > fileSize ? 100 : (uploadedBytes / fileSize) * 100;
  //     process.stdout.clearLine();
  //     process.stdout.cursorTo(0);
  //     process.stdout.write(uploadedMBytes.toFixed(2) + ' MBs uploaded. ' +
  //         progress.toFixed(2) + '% completed.');
  //     if (progress === 100) {
  //         process.stdout.write('\nDone uploading, waiting for response...\n');
  //         clearInterval(id);
  //     }
  // }, 250);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {

  console.log("creds : ",credentials);

  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];  // In Case of an open AWS Server - add its AWS Link to prove a GET Token in the browser URL 

  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

// # https://developers.google.com/youtube/v3/docs/videos#resource
// # https://console.cloud.google.com/apis/api/youtube.googleapis.com/

// # https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=1097072280118-c8bbtdklkf14p2n6uu4b1a05hb4d13jr.apps.googleusercontent.com&redirect_uri=http://127.0.0.1:5000&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload&state=M0TanZdLudVIsSo6tAHnLr7RU7xxhw&prompt=consent&access_type=offline
// # https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=1097072280118-c8bbtdklkf14p2n6uu4b1a05hb4d13jr.apps.googleusercontent.com&redirect_uri=http://localhost:5000&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload&state=VpQ95arSFikDp9jhdmkvwcwsrhspU5&prompt=consent&access_type=offline



// # POST https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatus&key=[YOUR_API_KEY] HTTP/1.1

// # Authorization: Bearer [YOUR_ACCESS_TOKEN]
// # Accept: application/json
// # Content-Type: application/json

// # {
// #   "snippet": {
// #     "categoryId": "22",
// #     "description": "Description of uploaded video.",
// #     "title": "Test video upload."
// #   },
// #   "status": {
// #     "privacyStatus": "private"
// #   }
// # }