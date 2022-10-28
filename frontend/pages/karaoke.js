import { supabase } from '../lib/initSupabase';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Avatar } from '@mantine/core';
import Video from '../components/karaoke/video'
import 'plyr/dist/plyr.css'
import Comments from '../components/karaoke/comment';

function rectifyFormat(s) {
  let b = s.split(/\D/);
  return b[0] + '-' + b[1] + '-' + b[2] + 'T' +
         b[3] + ':' + b[4] + ':' + b[5] + '.' +
         b[6].substr(0,3) + '+00:00';
}

export default function Karaoke() {
  const [videoMetaData, setVideoMediaData] = useState();
  const [videoSource, setVideoSource] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let {data, error} = await supabase.from('video').select();
      console.log(data);
      if(error) {
        console.log('error: ', error);   
        return;
      } else {
        setVideoSource(data[0].videourl);
        setVideoMediaData(data[0]);
      }
    }

    fetchData();
  }, [])

  const dateString = useMemo(() => {
    if(videoMetaData) {
      const date = new Date(rectifyFormat(videoMetaData?.created_at))
      return date.toLocaleDateString();
    } 

    return "";
  }, [videoMetaData]);

  const videoViews = useMemo(() => {
    if(videoMetaData) {
      return new Intl.NumberFormat().format(videoMetaData?.views);
    } 

    return "0";
  }, videoMetaData)

  return (
    <>
      {/* <div style={{width: '640px', height: '360px', display: 'flex', flexDirection: "column",justifyContent: 'start', alignItems: 'start', backgroundColor: 'black'}}>
      </div> */}
      <Video />
      <div style={{width: '640px', height: '360px', display: 'flex', flexDirection: "column",justifyContent: 'start', alignItems: 'start'}}>
        <div style={{marginBottom: '0.5rem', display: 'flex', flexDirection: 'row', justifyContent: 'start'}}>
          <p style={{fontSize: '1.5rem',marginBottom: 0}}>{videoMetaData?.title}</p>
        </div> 
        <div style={{marginBottom: '0.5rem', display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center'}}>
          <p style={{fontSize: '0.9rem', marginTop: 0, marginBottom: 0, marginRight: '0.5rem'}}>{dateString}</p>
          <p style={{fontSize: '0.9rem', marginTop: 0, marginBottom: 0}}>{videoViews} views</p>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', marginBottom: '2rem'}}>
          <Avatar style={{marginRight: '0.5rem'}} radius="xl" alt="no image here"/>
          <p style={{margin: 0, marginRight:'0.5rem'}}>Author Username</p>
        </div> 
         <Comments />
      </div>
    </>
  )
}