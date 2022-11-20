import { supabase } from "../../lib/initSupabase";
import { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

// binary search lyrics array for correct timestamp
const findIndex = (time, lyricsArr) => {
  let l = 0;
  let r = lyricsArr.length - 1;

  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);

    if (lyricsArr[mid].start <= time && lyricsArr[mid].end >= time) {
      return mid;
    } else if (lyricsArr[mid].start < time && lyricsArr[mid].end < time) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }

  return -1;
};

export default function Video() {
  const [videoSource, setVideoSource] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lyricsIndex, setLyricsIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [lyricsArr, setLyricsArr] = useState([]);
  const [timeoutId, setTimeoutId] = useState(0);
  const videoRef = useRef(null);
  let player = null;

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

  const handleVideoPaused = useCallback(() => {
    setIsVideoPlaying(false);
  }, []);

  const handleVideoPlaying = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  // get video source
  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase.from("video").select();
      if (error) {
        console.log("error: ", error);
        return;
      } else {
        setVideoSource(data[0].videourl);
        setLyricsArr(data[0].lyrics);
        setRemainingTime(data[0].lyrics[0].end - data[0].lyrics[0].start);
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
    };
  }, [videoSource, videoRef]);

  // setTimeout to countdown lyric change
  useEffect(() => {
    if (isVideoPlaying) {
      console.log(lyricsIndex);
      const newTimeoutId = setTimeout(() => {
        if (lyricsIndex < lyricsArr.length - 1) {
          setRemainingTime(
            lyricsIndex < lyricsArr.length
              ? lyricsArr[lyricsIndex + 1].end -
                  lyricsArr[lyricsIndex + 1].start
              : 10
          );
          setLyricsIndex((prev) => prev + 1);
        }
      }, remainingTime * 1000);
      setTimeoutId(newTimeoutId);
    }
  }, [remainingTime, isVideoPlaying]);

  // change remainingTime when video pauses
  useEffect(() => {
    if (timeoutId !== 0 && !isVideoPlaying) {
      let index = findIndex(videoRef.current.plyr.currentTime, lyricsArr);
      clearTimeout(timeoutId);
      setTimeoutId(0);
      setLyricsIndex(index);
      setRemainingTime(
        lyricsIndex < lyricsArr.length && index !== -1
          ? lyricsArr[index].end - videoRef.current.plyr.currentTime
          : 10
      );
    }
  }, [videoRef, isVideoPlaying, timeoutId]);

  const handleSubTitleClick = () => {
    if (videoRef.current.plyr?.paused) {
      videoRef.current.plyr.play();
    } else if (videoRef.current.plyr.playing) {
      videoRef.current.plyr.pause();
    }
  };

  return (
    <div style={{ width: "clamp(100%, 95vw, 100%)", position: "relative" }}>
      <video style={{ width: "100%" }} ref={videoRef} />
      {isVideoPlaying && (
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
            {`${
              lyricsIndex < lyricsArr.length
                ? lyricsArr[lyricsIndex].lyrics
                : ""
            }`}
          </p>
        </div>
      )}
    </div>
  );
}
