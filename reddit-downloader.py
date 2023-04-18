import requests,os
import praw #reddit
import re #regex
import pyautogui
import time

def create_reddit_object():
    reddit = praw.Reddit(client_id="XJ1vQ1MbsW7UMF0wczYvBw", 
                    client_secret="LqhIjW4PNHvLzCYVQxOZljB0JOkgTg",
                    user_agent = "megamind",
                    username = "LocksmithSuch8024",
                    password = "Lovely@2785",)
    return reddit

reddit = create_reddit_object()

subred = reddit.subreddit("funny")

hot = subred.hot(limit = 20)
new = subred.new(limit = 20)
count = 0
for i in hot:
    count = count+1
    if(re.findall("^https://v.redd.it/",i.url)!=[]) :
        title = re.sub(r'\W+', '', i.title)
        if(len(title)>12):
            title = title[:10]
        
        print(title, "https://www.reddit.com" + i.permalink[:-1])
        seconds = time.time()
        local_time = time.ctime(seconds)
        # fileptr = open("log.txt","a")  
        # fileptr.write("Title : "+i.title+" \nUploading Time : "+local_time+" \n\n")
        # fileptr.close() 
        url = "https://www.reddit.com" + i.permalink[:-1]+".json"
   
        r = requests.get(url,headers={"User-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"})
     
        data = r.json()[0]
        video_url = data["data"]['children'][0]['data']['secure_media']['reddit_video']['fallback_url']
        audio_url = "https://v.redd.it/"+video_url.split("/")[3]+"/DASH_audio.mp4"
        
        with open("vids\\video.mp4","wb") as f:
            g = requests.get(video_url,stream=True)
            f.write(g.content)
        with open("vids\\audio.mp3","wb") as f:
            g = requests.get(audio_url,stream=True)
            f.write(g.content)
        videooutputname = title
        command = "ffmpeg -i vids\\video.mp4 -i vids\\audio.mp3 -c copy vids\\output"+str(count)+".mp4"
        os.system(command)
        # print("Created Output : "+i.title)
        file1 = open("output-names.txt", "a")  # append mode
        file1.write("output"+str(count)+".mp4,")
        file1.close()
        pyautogui.sleep(5)
        os.system("del /f /q vids\\video.mp4")
        print("deleted video.mp4.....")
        pyautogui.sleep(5)
        os.system("del /f /q vids\\audio.mp3")
        print("deleted audio.mp3.....")