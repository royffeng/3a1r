import { supabase } from '../../lib/initSupabase';
import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

/*
  no animation,
  set interval based on button click
  seek: 

  document.querySelector('.plyr').addEventListener('seeking', () => {
    console.log('seeking');
  });
*/
const LYRICS = [
  {
    lyrics: "intro",
    start: 0,
    end: 9.9,
  },
  {
    lyrics: "날 보는 eyes, 씩 웃는 lips, 맘에 들지, I like it (oh, yeah)",
    start: 9.9,
    end: 13.542464, 
  },
  {
    lyrics: "네 A to Z, 꽤 달콤해 (that's right)",
    start: 13.542464,
    end: 16.341872,
  },
  {
    lyrics: "But I wanna skip (Just skip)",
    start: 16.341872,
    end: 18.277354,
  }
]

export default function Video() {
  const [videoSource, setVideoSource] = useState("");
  const [playing, setPlaying] = useState(false);
  const [lyrics, setLyrics] = useState(0);
  const [remainingTime, setRemainingTime] = useState(LYRICS[0].end - LYRICS[0].start);
  const [timeoutId, setTimeoutId] = useState(0);
  const videoRef = useRef(null);
  let player = null;
  
  const setSelectors = () => {
    document.querySelector('.plyr')?.removeEventListener('pause', handleVideoPaused, true);
    document.querySelector('.plyr')?.removeEventListener('playing', handleVideoPlaying, true);
    document.querySelector('.plyr')?.addEventListener('pause', handleVideoPaused);
    document.querySelector('.plyr')?.addEventListener('playing', handleVideoPlaying);
  }

  useEffect(() => {
    const fetchData = async () => {
      let {data, error} = await supabase.from('video').select();
      if(error) {
        console.log('error: ', error);   
        return;
      } else {
        setVideoSource(data[0].videourl);
      }
    }

    fetchData();
  }, [])

  // start video
  useEffect(() => {
    const video = videoRef.current
    if (!video || videoSource == '') return

    video.controls = true;
    const options = {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay'],
      fullscreen: {enabled: false}
    };
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSource;
    } else {
      const hls = new Hls();
      hls.loadSource(videoSource);
      player = new Plyr(video, options); 
      hls.attachMedia(video);

      document.querySelector('.plyr').addEventListener('seeking', () => {
        console.log(videoRef.current.plyr.currentTime);
      });
      setSelectors();
    }
  }, [videoSource, videoRef])

  useEffect(() => {
    setSelectors();
    if(playing) {
      const newTimeoutId = setTimeout(() => {
        setLyrics(prev => prev + 1);
      }, remainingTime * 1000);
      setTimeoutId(newTimeoutId);
    }
  }, [videoRef, remainingTime, playing])

  useEffect(() => {
    console.log("new lyrics: ", lyrics);
    setRemainingTime((lyrics < LYRICS.length) ? (LYRICS[lyrics].end - LYRICS[lyrics].start) : 10)
  }, [lyrics])

  const handleVideoPaused = () => {
    setPlaying(false);
    if(timeoutId !== 0) {
      clearTimeout(timeoutId);
      setTimeoutId(0);
    }
    // fix this
    setRemainingTime((lyrics < LYRICS.length) ? (LYRICS[lyrics].end - LYRICS[lyrics].start): 10);
  }

  const handleVideoPlaying = () => {
    setPlaying(true);
  }

  const handleSubTitleClick = () => {
    if(videoRef.current.plyr?.paused) {
      videoRef.current.plyr.play();
    } else if(videoRef.current.plyr.playing){
      videoRef.current.plyr.pause();
    }
  }

  return (
    <div style={{position: "relative"}}>
      <video style={{maxWidth: "100%"}} ref={videoRef}/>
      {(playing) && 
        <div 
          onClick={handleSubTitleClick} 
          style={{
            color: 'white', 
            position: "absolute", 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            left: '10%', 
            bottom: '25%', 
            right: '10%', 
            top: '25%',
          }}
        >
          <p style={{
            fontSize: "3rem", 
            textAlign: "center",
          }}
        >
          {/* {`${lyrics}`} */}
          {`${lyrics} ${(lyrics < LYRICS.length) ? LYRICS[lyrics].lyrics : 'Hello World'}`}
        </p>
        </div>
      }
    </div>
  )
}