import { supabase } from '../../lib/initSupabase';
import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

export default function Video() {
  const [videoSource, setVideoSource] = useState("");
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  let player = null;

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
      const hls = new Hls()
      hls.loadSource(videoSource)
      player = new Plyr(video, options); 
      hls.attachMedia(video)
    }
  }, [videoSource, videoRef])

  const handleVideoClick = () => {
    if(videoRef.current.plyr?.paused) {
      setPlaying(false);
    } else if(!videoRef.current.plyr.paused){
      setPlaying(true); 
    }
  }

  const handleSubTitleClick = () => {
    if(videoRef.current.plyr?.paused) {
      videoRef.current.plyr.play();
      setPlaying(false);
    } else if(!videoRef.current.plyr.paused){
      videoRef.current.plyr.pause();
      setPlaying(true); 
    }
  }

  return (
      <>
        <div onClick={handleVideoClick} style={{position: "relative"}}>
          <video style={{maxWidth: "100%"}} ref={videoRef}/>
          {(playing) && 
            <div onClick={handleSubTitleClick} style={{color: 'white', position: "absolute", left: '20%', bottom: '20%', right: '20%', top: '20%' }}>
              <p>hello world</p>
            </div>
          }
        </div>
      </>
  )
}