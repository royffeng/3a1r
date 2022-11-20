import { supabase } from "../lib/initSupabase";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Avatar } from "@mantine/core";
import { rectifyFormat } from "../utils/formatUTC";
import { Button } from "@mantine/core";
import { Divider } from "@mantine/core";
import { Loader } from "@mantine/core";
import Video from "../components/karaoke/video";
import "plyr/dist/plyr.css";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import Comments from "../components/karaoke/comment";

export default function Karaoke() {
  const router = useRouter();
  const vid = useMemo(() => {
    return router.query.vid;
  }, [router]);
  const [videoMetaData, setVideoMediaData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("video")
        .select()
        .filter("id", "eq", vid);
      if (error) {
        console.log("error: ", error);
        return;
      } else {
        setVideoMediaData(data[0]);
      }
    };

    if (vid) {
      fetchData();
    }
  }, [vid]);

  const dateString = useMemo(() => {
    if (videoMetaData) {
      return rectifyFormat(videoMetaData?.created_at);
    }

    return "";
  }, [videoMetaData]);

  const videoViews = useMemo(() => {
    if (videoMetaData) {
      return new Intl.NumberFormat().format(videoMetaData?.views);
    }

    return "0";
  }, [videoMetaData]);

  return (
    <div
      style={{
        padding: "0 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {videoMetaData == null || videoMetaData == undefined ? (
        <div
          style={{
            width: "clamp(100%, 95vw, 100%)",
            height: "360px",
            position: "relative",
            background:
              "linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <Video
          videoSource={videoMetaData.videourl}
          lyricsArr={videoMetaData.lyrics}
        />
      )}
      <div
        className="below-player-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
        }}
      >
        <div
          className="video-title"
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
          }}
        >
          <p style={{ fontSize: "1.5rem", marginBottom: 0 }}>
            {videoMetaData?.title}
          </p>
        </div>
        <div
          className="video-date-views"
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              marginTop: 0,
              marginBottom: 0,
              marginRight: "0.5rem",
            }}
          >
            {dateString}
          </p>
          <p style={{ fontSize: "0.9rem", marginTop: 0, marginBottom: 0 }}>
            {videoViews} views
          </p>
        </div>
        <div
          className="video-user"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              style={{ marginRight: "0.5rem" }}
              radius="xl"
              alt="no image here"
            />
            <p style={{ margin: 0, marginRight: "0.5rem" }}>Author Username</p>
          </div>
          <div
            className="video-likes-dislikes"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              style={{ marginRight: "0.25rem" }}
              color="gray"
              compact
              size="xs"
              variant="light"
              radius="xl"
            >
              <AiFillLike size={12} />
            </Button>
            <p style={{ marginRight: "0.5rem" }}>{120}</p>
            <Button
              style={{ marginRight: "0.25rem" }}
              color="gray"
              compact
              size="xs"
              variant="light"
              radius="xl"
            >
              <AiFillDislike size={12} />{" "}
            </Button>
            <p>{120}</p>
          </div>
        </div>
        <Divider style={{ width: "100%" }} size="sm" />
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          Comments
        </p>
        <Comments />
      </div>
    </div>
  );
}
