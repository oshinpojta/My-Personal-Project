//const tiktokDownloader = require("tiktok-downloader");
// const { 
//     downloader,
// } = require("instagram-url-downloader");

const axios = require("axios");
const cheerio = require("cheerio");
var videoshow = require('videoshow');
const { exec } = require("child_process");


exports.downloadReddit = async () => {

    const command = "py reddit-downloader.py";
    return new Promise((resolve, reject)=>{
        exec(command, (error, stdout, stderr) => {
            console.log("Terminal Output : ",stdout);
            console.log("Terminal Error : ",stderr);
            console.log("Error : ",error);
            if (error) {
              reject(error);
            } else {
              resolve(true);
            }
          });
    })
    
}

// AI IMAGE MIDJOURNEY
const imageVideoConverter = async () => {

    // https://stackoverflow.com/questions/34994195/nodejs-how-to-create-video-from-images

    var secondsToShowEachImage = 1
    var finalVideoPath = 'output.mp4'

    // setup videoshow options
    var videoOptions = {
    fps: 24,
    transition: false,
    videoBitrate: 1024 ,
    videoCodec: 'libx264', 
    size: '640x640',
    outputOptions: ['-pix_fmt yuv420p'],
    format: 'mp4' 
    }

    // array of images to make the 'videoshow' from
    var images = [
    {path: path1, loop: secondsToShowEachImage}, 
    {path: path2, loop: secondsToShowEachImage}
    ]

    videoshow(images, videoOptions)
    .save(finalVideoPath)
    .on('start', function (command) { 
    console.log('encoding ' + finalVideoPath + ' with command ' + command) 
    })
    .on('error', function (err, stdout, stderr) {
    return Promise.reject(new Error(err)) 
    })
    .on('end', function (output) {

        // NOW ADD SOUND TO VIDEO OUTPUT
        // https://stackoverflow.com/questions/56734348/how-to-add-audio-to-video-with-node-fluent-ffmpeg
        new FFmpeg()
    .addInput(video)
    .addInput(audio)
    .saveToFile(destination, "./temp");



        
    })
}

const getVideo = async (url) => {
  const html = await axios.get("https://discord.com/channels/662267976984297473/997271750368833636");
  console.log(`html: ${html.data}`);
  const $ = cheerio.load(html.data);
  // console.log(`cheerio: ${$}`);
  const videoString = $("video").html()
  console.log(`videoString: ${videoString}`);
  return videoString;
};

exports.downloadTiktok = async () => {
    try {
        return new Promise((resolve)=>{

            const TikTok = new tiktokDownloader.JSTikTok("URL");
            TikTok.get().then(function(){
                //Log the video title
                console.log(TikTok.datas.video.title);
                
                //Start download
                TikTok.video_download();
            });

            resolve(true);
        })
    } catch (error) {
        return new Promise((resolve)=>{
            resolve(null);
        })
    }
}




const options = {
  method: 'GET',
  url: 'https://murbil-instagram-media-download-v1.p.rapidapi.com/GetVideoLink',
  params: {Url: 'https://www.instagram.com/reels/ConHLvwAEux/'},
  headers: {
    'X-RapidAPI-Key': '233391423dmsh1acf28a04e6779fp1c541fjsnc2b348f82f8e',
    'X-RapidAPI-Host': 'murbil-instagram-media-download-v1.p.rapidapi.com'
  }
};



exports.downloadInsta = async () => {
    try {
        return new Promise(async (resolve)=>{

            const encodedParams = new URLSearchParams();
            encodedParams.append("url", "https://www.instagram.com/reels/CojZsmgMvsj");

            const options = {
                method: 'POST',
                url: 'https://instagram-video-or-images-downloader.p.rapidapi.com/',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'X-RapidAPI-Key': '233391423dmsh1acf28a04e6779fp1c541fjsnc2b348f82f8e',
                    'X-RapidAPI-Host': 'instagram-video-or-images-downloader.p.rapidapi.com'
                },
                data: encodedParams
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
                console.error(error);
            });

            // const videoLink = await getVideo("https://www.instagram.com/reels/Coys2NPgjkT/");
            // console.log("Video LINK:63 :=> ", videoLink);

            // axios.request(options).then(function (response) {
            //     console.log(response.data);
            // }).catch(function (error) {
            //     console.error(error);
            // });

            // var  links  =  [ 
            //     "https://www.instagram.com/p/CZo8E9ZIGmq/" , // mixed 
            //     "https://www.instagram.com/p/CXGhz24j-jy/" ,  // video 
            //     "https: //www.instagram.com/p/CZklZk7N0yD/"  // image 
            // ] ;
            
            // for ( var  link  of  links )  {  // we are pulling each element one by one by inserting the above string into it 
            //     const download = new downloader(link, { Path : "./videos/"}); ;  // We create a new downloader by entering our url 
            //     let  media  =  download.media ;  // we pull the media data of our url
                
            //     console . log ( download )  // and we download this Media
            
            //     // this process will repeat for all links. 
            // }

            // resolve(true);
        })
    } catch (error) {
        return new Promise((resolve)=>{
            resolve(null);
        })
    }
}


// https://www.npmjs.com/package/instagram-url-downloader
// https://www.npmjs.com/package/tiktok-downloader

// const TikTok = new tiktokDownloader.JSTikTok("URL");

// TikTok.get().then(function(){

// 	TikTok.video_download();
	
// });

// const TikTok = new JSTikTok('TIKTOK_VIDEO_URL');

// TikTok.get().then(function(){

// 	TikTok.music_download();

// });



// -----------------------------------------------------------------------------------------

// const downloader = new Downloader("https://www.instagram.com/p/CZ99IqhFP80/");

// /* 
// * Returns the media of the url you entered as a constructor 
// * 
// * @name downloader#Media 
// * @returns { Constructor } 
// */ 
// let  media  =  downloader . media ; 
// //console.log(media) 
// //console.log(media.download()) 
// //console.log(media.audioDownload())

// /**
// * Girmiş olduğunuz urlnin sahip olduğu kullanıcıyı bir constructor olarak verir
// * 
// * @name downloader#user
// * @returns {Constructor}
// */
// let user = downloader.getUser;
// //console.log(user)
// //console.log(user.downloadProfilePhoto())
// //console.log(user.getStories)
// //console.log(user.getStories.download())
// //console.log(user.getHighlights)
// //console.log(user.getHighlights.download())

// /** 
// * Returns the stories of the user with the url you entered as constructor 
// * 
// * @name downloader#getUserStories 
// * @returns { Constructor } 
// */ 
// let  userStories  =  downloader . getUserStories ; 
// //console.log(userStories) 
// //console.log(userStories.download()) 
// //console.log(userStories.audioDownload())

// /** 
// * Returns the information of the user with the name you entered 
// * 
// * @name User 
// * @returns { Constructor } 
// */ 
// let  fetchedUser  =  User ( "alp.kahyaa" ) 
// //console.log(fetchedUser) 
// //console.log(fetchedUser. downloadProfilePhoto()) 
// //console.log(fetchedUser.getStories) 
// //fetchedUser.getPosts(10).forEach(media => console.log(media.download()))

// /** 
// * Returns the story information of the user with the name you entered 
// * 
// * @name Stories 
// * @returns { Constructor } 
// */ 
// let  stories  =  Stories ( "enesbatur" ) 
// //console.log(stories) 
// //console.log(stories.download ()) 
// //console.log(stories.audioDownload())

// /** 
// * Returns the highlighted information of the user with the name you entered 
// * 
// * @name Highlights 
// * @returns { Constructor } 
// */ 
// let  highlights  =  Highlights ( "feriddemm" ) 
// // console.log(highlights) 
// //highlights.forEach(hl = > console.log(hl.download()))

// /** 
// * Returns the post information of the user with the name you entered 
// * 
// * @name Posts 
// * @returns { Constructor } 
// */ 
// let  posts  =  Posts ( "traveling" ) 
// //console.log(posts) 
// //posts.forEach(media => console.log(media.download()))