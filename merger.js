'use strict';
const path = require("path");
var ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = path.resolve(__dirname, "ffmpeg-master", "bin", "ffmpeg.exe");
const fs_promise = require("fs/promises");

const { exec } = require("child_process");

const concat = require('ffmpeg-concat')

exports.getVideoInfo = async (inputFile) => {
    return new Promise(async (resolve, reject) => {
        if(!inputFile){
            resolve(false);
            return
        }
        ffmpeg.ffprobe(`${path.resolve("vids", inputFile)}`,function(err, metadata) {
            console.log(metadata);
            resolve(metadata);
        });
    })
}

exports.setVideosResolution =  async (inputFile) => {
    return new Promise(async (resolve, reject) => {
        if(!inputFile){
            resolve(false);
            return
        }
        console.log("\n//////////////////////////// SETTING RESOLUTION ///////////////////////////////////////")
        let command = `ffmpeg -i ${path.resolve("vids", inputFile)} -vf scale=1280:720 -preset slow -crf 18 ${path.resolve("videos", inputFile)}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                resolve(false);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
            resolve(true);
        });
    })
}

exports.copyPasteFile =  async (inputFile) => {
    return new Promise(async (resolve, reject) => {
        if(!inputFile){
            resolve(false);
            return
        }
        console.log("\n//////////////////////////// COPYING FILE ///////////////////////////////////////")
        await fs_promise.copyFile(`${path.resolve("vids", inputFile)}`, `${path.resolve("videos", inputFile)}`);
        resolve(true);
    })
}

exports.mergeVideos = async (inputFiles) => {
    return new Promise(async (resolve, reject) => {
        if(inputFiles.length <= 0){
            resolve(false);
            return
        }

        let videoQuery = `${path.resolve("videos", inputFiles[0])} `;
        videoQuery += `-cat beep.mp4 `;
        for(let i=1; i<inputFiles.length;i++){
            videoQuery += `-cat ${path.resolve("videos", inputFiles[i])} `;
            videoQuery += `-cat beep.mp4 `;
        }

        exec(`mp4box -force-cat -add ${videoQuery} output.mp4`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                resolve(false);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
            resolve(true);
        });

        // let videoQuery2 = ""
        // let mapQuery = "";
        // let filterQuery = "";
        // for(let i=0; i<inputFiles.length;i++){
        //     console.log(inputFiles[i]);
        //     videoQuery2 += "-i vids\\"+inputFiles[i]+" ";
        //     filterQuery += `[${i}:v] [${i}:a] `;
        //     mapQuery += "-map "+i+" ";
        // }
        // exec(`ffmpeg ${videoQuery2} -filter_complex "${filterQuery}concat=n=${inputFiles.length}:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" output.mp4`, (error, stdout, stderr) => {
        //     if (error) {
        //         console.log(`error: ${error.message}`);
        //         resolve(false);
        //         return;
        //     }
        //     if (stderr) {
        //         console.log(`stderr: ${stderr}`);
        //     }
        //     console.log(`stdout: ${stdout}`);
        //     resolve(true);
        // });
    })
}




// os.system("ffmpeg -f concat -i videonames.txt -c copy vids\\output.mp4")
// os.system("del /f /q "+hashtag_name+"\\*.*")
// os.system("del /f /q *.mp4")
// os.system("del /f /q videonames.txt")

// videoMerge({
//   // ffmpeg_path: <path-to-ffmpeg> Optional. Otherwise it will just use ffmpeg on your $PATH
// })
//   .original({
//     "fileName": "FILENAME",
//     "duration": "hh:mm:ss"
//   })
//   .clips([
//     {
//       "startTime": "hh:mm:ss",
//       "fileName": "FILENAME",
//       "duration": "hh:mm:ss"
//     },
//     {
//       "startTime": "hh:mm:ss",
//       "fileName": "FILENAME",
//       "duration": "hh:mm:ss"
//     },
//     {
//       "startTime": "hh:mm:ss",
//       "fileName": "FILENAME",
//       "duration": "hh:mm:ss"
//     }
//   ])
//   .merge()
//   .then((outputFile) => {
//     console.log('path to output file', outputFile);
//   });