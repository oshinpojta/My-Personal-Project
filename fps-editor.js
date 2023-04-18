const { exec } = require('child_process');
const path = require("path");

exports.convertTo60fps = (inputFile, outputFile) => {
    const ffmpegPath = path.resolve(__dirname, "ffmpeg-master", "bin", "ffmpeg.exe");
  return new Promise((resolve, reject) => {
    const command = `${ffmpegPath} -i "${inputFile}" -r 60 -filter:v "setpts=1.0*PTS,minterpolate='fps=60:me=tesa:me_mode=bidir:search_param=32'" "${outputFile}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
