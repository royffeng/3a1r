import { supabase } from '../lib/initSupabase';
import { useState, useEffect, useMemo, useRef } from 'react';
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
export default function Video() {
    const [videoSource, setVideoSource] = useState("");
    const videoRef = useRef(null);

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
      const defaultOptions = {};
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSource;
      } else {
        const hls = new Hls()
        hls.loadSource(videoSource)
        const player = new Plyr(video, defaultOptions); 
        hls.attachMedia(video)
      }
    }, [videoSource, videoRef])

    return (
      <>
        <p>video here</p>
        <>
          <video style={{"maxWidth": "100%"}} ref={videoRef}/>
        </>
      </>
    )
}