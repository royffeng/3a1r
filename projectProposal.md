# NAME TBD
### Project Proposal

## Introduction
If you want to sing karaoke at home, there are several YouTube Channels like [Sing King](https://www.youtube.com/c/singkingkaraoke/videos) and [TJ Karaoke](https://www.youtube.com/c/TJ%EB%85%B8%EB%9E%98%EB%B0%A9TJKaraoke) that host karaoke videos.
These channels upload videos daily or weekly with the newest songs, usually requested by viewers in the comments section. 

Creating Karaoke videos is tedious work:
- Downloading videos off the internet takes several minutes
- Editing the timing of the lyrics requires that you understand music theory concepts such as rhythm and meter.
- Cannot possibly know which karaoke videos you should create. 
- There is little custom control the user has. Karaoke places often have remotes that let you display the musical notes of the song, play a cheering sound effect, change the key of the song.

NAME TBD solves this problem and adds more functionality to a YouTube karaoke session.

Generator Service:
1. Create Algorithms the generate karaoke videos
2. Get the lyrics and timestamps of the lyrics of a video using https://github.com/openai/whisper

Website:
1. Users will sign up on the website and create profiles. They can add their spotify playlist to their account and the generator will show videos based on their playlists (medium)
2. Home page will list the top karaoke videos (easy)
3. Build out a search functionality for videos (difficult)
4. If a video doesn't exist you can add a karaoke video once every x minutes. (need to rate limit users so we don't pay $$$$) Or, we make a voting system that allows people to vote for which videos are created next. Either way we can't infinitely generate videos or our hosting $$$ will go up.
5. You can add other users - necessary for generating metadata / recommender system
6. Generate karaoke videos based on top 50 of each region (medium), website can be built in parallel with videos because frontend will just read a json and generate the video based on the json data


## Software Spec
Python Recommender System:
Building a recommender system ML that will recommend videos based on metadata we gather from the karaoke videos. (Possibly will not build but maybe design)

Python Generator Service:
Suite of algorithms that will take a music video .mp3 as input and output the lyrics and timestamps for each lyric.
- Maybe the service generates the actual karaoke video?

Backend:
Python Generator Service:
Flask REST API that will create karaoke videos and store them on our database

Website
Options:
- MongoDB (hosted for us :D)
* can store blobs for videos and profile pictures
* No need for middleware endpoints
- Supabase (hosted for us :D)
* can store blobs for videos and profile pictures
* No need for middleware endpoints

Frontend:
Built using [Next.js](https://nextjs.org/), [React](https://reactjs.org/), and [Mantine UI Library](https://mantine.dev/)
- @ashley-kim22 designs and @Alamode89 codes :^)

Hosting:
- @royffeng can you work with AWS to host the generator service and the website?
- if not, we can host the website using netlify, and use another hosting service for the generator service
