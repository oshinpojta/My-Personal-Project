import requests,os
import praw #reddit
import re #regex
import time
import random

def create_reddit_object():
    reddit = praw.Reddit(client_id="XJ1vQ1MbsW7UMF0wczYvBw", 
                    client_secret="LqhIjW4PNHvLzCYVQxOZljB0JOkgTg",
                    user_agent = "megamind",
                    username = "LocksmithSuch8024",
                    password = "Lovely@2785",)
    return reddit

reddit = create_reddit_object()

subreddit_array = ["funny", "TikTokCringe", "WatchPeopleDieInside"] # "KidsAreFuckingStupid"
# random_number = random.randint(0, len(subreddit_array))

# Read Counter Number For Sub-Reddit
subreddit_counter = open("subreddit_counter.txt","r+")
subred_number = subreddit_counter.readline()
subred_number = int(subred_number)
subreddit_counter.close()
print("Subred No. ", subred_number)
# Update Counter Number
subreddit_counter = open("subreddit_counter.txt","w")
subreddit_counter.write( str((subred_number+1)%len(subreddit_array)))
subreddit_counter.close()
print("Downloading From SubRed : ",subreddit_array[subred_number])
subred = reddit.subreddit(subreddit_array[subred_number])

hot = subred.hot(limit = 20)
new = subred.new(limit = 20)
count = 0
for i in hot:
    if count >= 7 :
        break
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
        with open(os.path.join("vids", "video.mp4"),"wb") as f:
            g = requests.get(video_url,stream=True)
            f.write(g.content)
        with open(os.path.join("vids", "audio.mp3"),"wb") as f:
            g = requests.get(audio_url,stream=True)
            f.write(g.content)
        videooutputname = title
        command = "ffmpeg -i "+os.path.join("vids", "video.mp4")+" -i "+os.path.join("vids", "audio.mp3")+" -c copy "+os.path.join("vids", "output")+str(count)+".mp4"
        os.system(command)
        # print("Created Output : "+i.title)
        file1 = open("output-names.txt", "a")  # append mode
        file1.write("output"+str(count)+".mp4,")
        file1.close()
        time.sleep(5)
        os.system("del /f /q "+os.path.join("vids", "video.mp4"))
        print("deleted video.mp4.....")
        time.sleep(5)
        os.system("del /f /q "+os.path.join("vids", "video.mp4"))
        print("deleted audio.mp3.....")