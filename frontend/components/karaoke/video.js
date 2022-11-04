import { supabase } from "../../lib/initSupabase";
import { useState, useEffect, useRef } from "react";
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

export default function Video() {
  const [videoSource, setVideoSource] = useState("");
  const [playing, setPlaying] = useState(false);
  const [lyrics, setLyrics] = useState(0);
  const [remainingTime, setRemainingTime] = useState(
    LYRICS[0].end - LYRICS[0].start
  );
  const [timeoutId, setTimeoutId] = useState(0);
  const videoRef = useRef(null);
  let player = null;

  const setSelectors = () => {
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
  };

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
        "settings",
        "pip",
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

      document.querySelector(".plyr").addEventListener("seeking", () => {
        console.log(videoRef.current.plyr.currentTime);
      });
      setSelectors();
    }
  }, [videoSource, videoRef]);

  useEffect(() => {
    setSelectors();
    if (playing) {
      const newTimeoutId = setTimeout(() => {
        if (lyrics < LYRICS.length - 1) {
          setLyrics((prev) => prev + 1);
        }
      }, remainingTime * 1000);
      setTimeoutId(newTimeoutId);
    }
  }, [videoRef, remainingTime, playing]);

  useEffect(() => {
    console.log("new lyrics: ", lyrics);
    setRemainingTime(
      lyrics < LYRICS.length ? LYRICS[lyrics].end - LYRICS[lyrics].start : 10
    );
  }, [lyrics]);

  const handleVideoPaused = () => {
    setPlaying(false);
    if (timeoutId !== 0) {
      clearTimeout(timeoutId);
      setTimeoutId(0);
    }
    // fix this
    setRemainingTime(
      lyrics < LYRICS.length ? LYRICS[lyrics].end - LYRICS[lyrics].start : 10
    );
  };

  const handleVideoPlaying = () => {
    setPlaying(true);
  };

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
            bottom: "25%",
            right: "10%",
            top: "25%",
          }}
        >
          <p
            style={{
              fontSize: "3rem",
              textAlign: "center",
            }}
          >
            {`${lyrics < LYRICS.length ? LYRICS[lyrics].lyrics : ""}`}
          </p>
        </div>
      )}
    </div>
  );
}
