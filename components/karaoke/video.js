import { Flex, Text } from "@mantine/core";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { useCallback, useEffect, useRef, useState } from "react";

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

export default function Video({ textColor, videoSource, lyricsArr }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [wasSeeking, setWasSeeking] = useState(false);
  const [lyricsIndex, setLyricsIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timeoutId, setTimeoutId] = useState(0);
  const videoRef = useRef(null);

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
    document
      .querySelector(".plyr")
      ?.addEventListener("seeking", handleVideoSeeking);
  }, []);

  const handleVideoSeeking = useCallback(() => {
    setWasSeeking(true);
  }, []);

  const handleVideoPaused = useCallback(() => {
    setIsVideoPlaying(false);
  }, []);

  const handleVideoPlaying = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  useEffect(() => {
    setRemainingTime(lyricsArr[0].end - lyricsArr[0].start);
  }, [lyricsArr]);

  // start video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoSource == "") return;
    video.disablePictureInPicture = true;
    const options = {
      controls: ["play", "progress", "current-time", "mute", "volume"],
      fullscreen: { enabled: false },
    };
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSource;
    } else {
      const hls = new Hls();
      hls.loadSource(videoSource);
      new Plyr(video, options);
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
    if (wasSeeking) {
      let index = findIndex(videoRef.current.plyr.currentTime, lyricsArr);
      if (timeoutId !== 0) {
        clearTimeout(timeoutId);
        setTimeoutId(0);
      }
      setLyricsIndex(index);
      setRemainingTime(
        lyricsIndex < lyricsArr.length && index !== -1
          ? lyricsArr[index].end - videoRef.current.plyr.currentTime
          : 10
      );
      setWasSeeking(false);
    } else if (isVideoPlaying) {
      const newTimeoutId = setTimeout(() => {
        if (lyricsIndex < lyricsArr.length - 1) {
          setRemainingTime(
            lyricsIndex < lyricsArr.length && lyricsIndex !== -1
              ? lyricsArr[lyricsIndex + 1].end -
                  lyricsArr[lyricsIndex + 1].start
              : 10 // error
          );
          setLyricsIndex((prev) => prev + 1);
        }
      }, remainingTime * 1000);
      setTimeoutId(newTimeoutId);
    }
  }, [remainingTime, isVideoPlaying, lyricsIndex, wasSeeking]);

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
      <video
        disablePictureInPicture
        style={{ maxHeight: "100vh", width: "100%" }}
        ref={videoRef}
      />
      {isVideoPlaying && (
        <div
          onClick={handleSubTitleClick}
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            left: "5%",
            bottom: "10%",
            right: "5%",
            top: "10%",
          }}
        >
          <Flex direction="column">
            <Text
              className="lyrics"
              align="center"
              color={textColor}
              style={{
                fontSize: "calc(clamp(1rem, 8vw, 20vw)/1.5)",
                textShadow:
                  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
              }}
            >
              {`${
                lyricsIndex < lyricsArr.length && lyricsIndex !== -1
                  ? lyricsArr[lyricsIndex].lyrics
                  : ""
              }`}
            </Text>
            <Text
              className="lyrics"
              align="center"
              color={"rgba(227, 227, 227, 0.5)"}
              style={{
                fontSize: "calc(clamp(1rem, 8vw, 20vw)/1.5)",
              }}
            >
              {`${
                lyricsIndex < lyricsArr.length - 1 &&
                lyricsIndex !== -1 &&
                lyricsIndex !== 0
                  ? lyricsArr[lyricsIndex + 1].lyrics
                  : ""
              }`}
            </Text>
          </Flex>
        </div>
      )}
    </div>
  );
}
