import { supabase } from "../../lib/initSupabase";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { LYRICS } from "./twiceDemo";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

/*
  TODO: 
  1. seek binary search change position
  2. Pause change remaining time
  3. Handle case when it ends
*/

const findIndex = (time, lyricsArr) => {
  let l = 0;
  let r = lyricsArr.length - 1;

  while(l <= r) {
    let mid = Math.floor(l + (r - l) / 2);

    if(lyricsArr[mid].start <= time && lyricsArr[mid].end >= time) {
      return mid;
    } else if(lyricsArr[mid].start < time && lyricsArr[mid].end < time) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }

  return -1;
};

export default function Video() {
  const [videoSource, setVideoSource] = useState("");
  const [playing, setPlaying] = useState(false);
  const [lyrics, setLyrics] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timeoutId, setTimeoutId] = useState(0);
  const videoRef = useRef(null);
  let player = null;

  const lyricsArr = useMemo(() => {
    return LYRICS;
  })

  useEffect(() => {
    setRemainingTime(lyricsArr[0].end - lyricsArr[0].start);
  }, [lyricsArr])

  const setSelectors = useCallback(() => {
    document
      .querySelector(".plyr")
      ?.removeEventListener("pause", handleVideoPaused, true);
    document
      .querySelector(".plyr")
      ?.removeEventListener("playing", handleVideoPlaying, true);
    document
      .querySelector(".plyr")
      ?.addEventListener("pause", handleVideoPaused);
    document
      .querySelector(".plyr")
      ?.addEventListener("playing", handleVideoPlaying);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase.from("video").select();
      if (error) {
        console.log("error: ", error);
        return;
      } else {
        setVideoSource(data[0].videourl);
      }
    };

    fetchData();
  }, []);

  // start video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoSource == "") return;

    video.controls = true;
    const options = {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "airplay",
      ],
      fullscreen: { enabled: false },
    };
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSource;
    } else {
      const hls = new Hls();
      hls.loadSource(videoSource);
      player = new Plyr(video, options);
      hls.attachMedia(video);
      setSelectors();
    }

    return () => {
    document
      .querySelector(".plyr")
      ?.removeEventListener("pause", handleVideoPaused, true);
    document
      .querySelector(".plyr")
      ?.removeEventListener("playing", handleVideoPlaying, true);
    }
  }, [videoSource, videoRef]);

  useEffect(() => {
    if (playing) {
      
      const newTimeoutId = setTimeout(() => {
        if (lyrics < lyricsArr.length - 1) {
          console.log("execute: ", lyrics);
          setRemainingTime(
            lyrics < lyricsArr.length ? lyricsArr[lyrics + 1].end - lyricsArr[lyrics + 1].start : 10
          );
          setLyrics((prev) => prev + 1);
        }
      }, remainingTime * 1000 );
      setTimeoutId(newTimeoutId);
    }
  }, [remainingTime, playing]);

  useEffect(() => {
    if(timeoutId !== 0 && !playing) {
      let index = findIndex(videoRef.current.plyr.currentTime, lyricsArr);
      console.log(videoRef.current.plyr)
      clearTimeout(timeoutId);
      setTimeoutId(0);
      setLyrics(index);
      setRemainingTime(
        lyrics < lyricsArr.length && index !== -1 ? lyricsArr[index].end - videoRef.current.plyr.currentTime : 10
      );
    }
  }, [videoRef, playing, timeoutId])

  const handleVideoPaused = useCallback(() => {
    setPlaying(false);
  }, []);

  const handleVideoPlaying = useCallback(() => {
    setPlaying(true);
  }, []);

  const handleSubTitleClick = () => {
    if (videoRef.current.plyr?.paused) {
      videoRef.current.plyr.play();
    } else if (videoRef.current.plyr.playing) {
      videoRef.current.plyr.pause();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <video style={{ width: "90vw" }} ref={videoRef} />
      {playing && (
        <div
          onClick={handleSubTitleClick}
          style={{
            color: "white",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            left: "10%",
            bottom: "50%",
            right: "10%",
            top: "50%",
          }}
        >
          <p
            style={{
              fontSize: "3rem",
              textAlign: "center",
            }}
          >
            {`${lyrics < lyricsArr.length ? lyricsArr[lyrics].lyrics : ""}`}
          </p>
        </div>
      )}
    </div>
  );
}
