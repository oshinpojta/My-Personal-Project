const express = require("express");
const uploader = require("./uploader");
const merger = require("./merger");
const downloader = require("./downloader");
const fps_editor = require("./fps-editor");
const fs_promise = require("fs/promises");
const path = require("path");
const cors = require("cors");


const apiCallsCountFilePath = path.resolve(__dirname, "api-call-count.txt");


const app = express();
app.listen(4000);
app.use(express.json());
app.use(cors());

app.use("/", (req, res, next) => {
    let code = req.query.code;
    res.json({ success : true, data : req.query });
})


async function worker(){
    //FPS EDITOR
    // await fps_editor.convertTo60fps(video_path1, "output.mp4");
    // return;

    // DOWNLOADER
    console.log("Trying to delete Previous output.mp4 file ... ");
    try {
        await fs_promise.unlink(path.resolve(__dirname, "output.mp4"));
    } catch (error) {
        console.log(error)
    }
    
    console.log("STARTING REDDIT-DOWNLOADER ... ");
    await downloader.downloadReddit();

    let inputFiles = [];
    try {
        let outputNames = await fs_promise.readFile(path.resolve(__dirname, "output-names.txt"), "utf-8");
        inputFiles = outputNames.split(",");
        inputFiles = inputFiles.slice(0, inputFiles.length-1);
    } catch (error) {
        console.log(error);
    }
    // RESOLUTION SETTER
    for(let i=0;i<inputFiles.length;i++){
        await merger.setVideosResolution(inputFiles[i]);
        // let data = await merger.getVideoInfo(inputFiles[i]);
        // if(data.streams[0].width < data.streams[0].height){
        //     await merger.setVideosResolution(inputFiles[i]);
        // }else{
        //     await merger.copyPasteFile(inputFiles[i]);
        // }
    }

    // MERGER
    console.log("MERGING VIDEOS ...")
    let result = await merger.mergeVideos(inputFiles);
    if(!result){
        console.log("ERROR : RESULT from MERGER : ", result);
        return;
    }

    // DELETING FILES NOT REQUIRED
    console.log("/////////////////////// DELETING VIDEO CACHE /////////////////////////////");
    try{
        await fs_promise.unlink(path.resolve(__dirname, "output-names.txt"));
    }catch(error){
        console.log(error);
    }

    let vids_directory = await fs_promise.readdir(path.resolve(__dirname, "vids"));
    try {
        for (const file of vids_directory) {
            fs_promise.unlink(path.join(__dirname, "vids", file), (err) => {
              if (err) throw err;
            });
        }
    } catch (error) {
        console.log(error);
    }

    let videos_directory = await fs_promise.readdir(path.resolve(__dirname, "videos"));
    try {
        for (const file of videos_directory) {
            fs_promise.unlink(path.join(__dirname, "videos", file), (err) => {
              if (err) throw err;
            });
        }
    } catch (error) {
        console.log(error);
    }

    /// UPLOADER
    console.log("UPLOADING ON YOUTUBE ...");
    let obj = await setAPICallsCount();
    console.log("API Call Data : - ", obj)
    if(!obj){
        console.log(" API Calls Count Exhausted or Error");
        return;
    }

    let titleCount = await fs_promise.readFile(path.resolve(__dirname, "title-count.txt"), "utf-8");
    let count = Number(titleCount);
    count++;
    await fs_promise.writeFile(path.resolve(__dirname, "title-count.txt"), String(count));

    let emoji1 = ["🤞", "👊", "👉", "💫", "⭐", "♕", "▶"];
    let randomNumber1 = Math.floor((Math.random()*10)%emoji1.length);
    let emoji2 = ["😂", "😪", "🤯", "🤪", "😢", "🐵", "🐱", "🐷", "🤮", "😧", "😅", "♡", "❌"];
    let randomNumber2 = Math.floor((Math.random()*10)%emoji2.length);
    let title = `${emoji1[randomNumber1]} Random Funny/Weird Videos On Internet #${titleCount} ${emoji2[randomNumber2]}`;
    let description = "#funny #viral #random #shorts #reddit #funnyvideos #funny #funnymemes #memes #comedy #meme #memesdaily #dankmemes #tiktok #fun #lol #viral #follow #explorepage #instagram #love #trending #funnyshit #explore #jokes #humor #like #comedyvideos #instagood #followforfollowback #funnyvideo #lmao #laugh #video #funnymeme #funnyvideos #funnyvideosdaily #funnyvideosclips #pubgfunnyvideos #btsfunnyvideos #punjabifunnyvideos #telugufunnyvideos #tiktokfunnyvideos #funnyvideosv #indianfunnyvideos #leagueoflegendsfunnyvideos #funnyvideosclip #kannadafunnyvideos #afghanfunnyvideos #marathifunnyvideos #kevinhartfunnyvideos #dogfunnyvideos #bestfunnyvideos #funnyvideos2018 #funnyvideoshiphop #funnyvideos2019 #hindifunnyvideos #funnyvideosandmemes_ #naijafunnyvideos #funnyvideoslel #tamilfunnyvideos #desifunnyvideos #funnyvideosever #funnyvideostags #pakistanifunnyvideos #funnyvideoswithsuaven2g #blackfunnyvideos #funnyvideosmemes #funnyvideosinhindi #funnyvideoshd #kidsfunnyvideos #funnyvideos2020 #funnyvideosdownload #fortnitefunnyvideos #funnyvideos2017 #gaming #pc";
    let tags = ""; //"gaming, food, movies";
    // let tagsArray = tags.split("#");
    // let keywords = "";
    // for(let i=0; i<tagsArray.length;i++){
    //     let tag = tagsArray[i];
    //     if(i == tagsArray.length-1){
    //         keywords += tag.trimEnd();
    //     }else if(tag.length > 1){
    //         keywords += tag.trimEnd()+",";
    //     }
    // }
    // console.log(keywords);
    const video_path = path.resolve(__dirname, "output.mp4");
    console.log("UPLOADING TO YOUTUBE | Title : "+title);
    uploader.uploadVideoToYoutube(video_path, title, description, tags, obj.client_secret, obj.token_path);

}


async function setAPICallsCount(){

    try {
        return new Promise(async (resolve, reject) => {
            let data = await fs_promise.readFile(apiCallsCountFilePath, "utf-8");
            let last_uploaded = await fs_promise.readFile("last_uploaded.txt", "utf-8");
            let isNanLastUploaded = isNaN(last_uploaded);
            data = JSON.parse(data);
            let count = data.count;

            if(data.count >= 6){
                let current_date = new Date();
                let last_uploaded_date = new Date(last_uploaded);
                let difference = current_date.getTime() - last_uploaded_date.getTime();
                let dayInMilli = 1000 * 60 * 60 * 24; // milliseconds * seconds * minutes * hours
                if(Math.abs(difference) < dayInMilli){
                    resolve(null);
                }else{
                    data.count = 0;
                }
            }
            let file_number = Math.abs(Math.floor(count/6)) + 1;
            let client_secret_path = path.resolve(__dirname, "client_secrets", `client_secret_1.json`);
            let token_path = path.resolve(__dirname, "client_oauth_tokens", `client_oauth_token_4.json`);
            data.count++;
            await fs_promise.writeFile(apiCallsCountFilePath, JSON.stringify(data));
            await fs_promise.writeFile("last_uploaded.txt", String(new Date().getTime()));
            console.log("API Calls Made : ", data.count);
            let obj = {
                client_secret : client_secret_path,
                token_path : token_path,
                count : data.count
            }
            resolve(obj);
        })
    } catch (error) {
        return new Promise((resolve, reject) => {
            resolve(null);
        })   
    }
}

async function insertToVideoList(videopath){
    try {
        return new Promise(async (resolve) => {
            await fs_promise.appendFile(video_names_txt, `file ${videopath}\n`);
            resolve(true);
        })
        
    } catch (error) {
        return new Promise((resolve) => {
            resolve(false);
        })
    }
}

async function deleteVideoNamesTxt(){
    return new Promise(async (resolve) => {
        await fs_promise.unlink(video_names_txt);
        resolve(true);
    })
}

// RUN UPLOADER

let minute = 1000*60;
let hour = minute*60;
let day = hour*24;

worker();
setInterval(worker, 7*day); // Youtube API free quota-cost per user is 1600 for 1 video insert (including error responses) / total available - 10000 :=> 6 api calls per day
// !IMPORTANT - to get code for authorization :- URL of server should be registered in Credentials (in all of the projects) : dont try console logging since its waiting to be entered in the terminal
