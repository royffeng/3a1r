import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Alert, Spoiler } from "@mantine/core";
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
  const supabase = useSupabaseClient();
  const router = useRouter();
  const vid = useMemo(() => {
    return router.query.vid;
  }, [router]);
  const [videoMetaData, setVideoMediaData] = useState(null);
  const [likes, setLikes] = useState();
  const [dislikes, setDislikes] = useState();
  const [liked, setLiked] = useState(false); // initial value depends on query
  const [disliked, setDisliked] = useState(false); // initial value depends on query

  const updateLikes = useCallback(async (vid, likes) => {
    let { error } = await supabase
      .from("video")
      .update({ likes: likes })
      .eq("id", vid);

    if (error) {
      console.log("error: ", error);
    }
  }, []);

  const updateDislikes = useCallback(async (vid, dislikes) => {
    let { error } = await supabase
      .from("video")
      .update({ dislikes: dislikes })
      .eq("id", vid);

    if (error) {
      console.log("error: ", error);
    }
  }, []);

  const handleLike = useCallback(
    (vid) => {
      if (disliked) {
        setDisliked(false);
        updateDislikes(vid, dislikes - 1);
        // TODO SET UP LIKES / DISLIKES RELATION TABLE
        setDislikes((d) => d - 1);
      }
      if (liked) {
        setLiked(false);
        updateLikes(vid, likes - 1);
        setLikes((l) => l - 1);
      } else {
        setLiked(true);
        updateLikes(vid, likes + 1);
        setLikes((l) => l + 1);
      }
    },
    [likes, dislikes]
  );

  const handleDislike = useCallback(
    (vid) => {
      if (liked) {
        setLiked(false);
        updateLikes(vid, likes - 1);
        setLikes((l) => l - 1);
      }
      if (disliked) {
        setDisliked(false);
        updateDislikes(vid, dislikes - 1);
        setDislikes((d) => d - 1);
      } else {
        setDisliked(true);
        updateDislikes(vid, dislikes + 1);
        setDislikes((d) => d + 1);
      }
    },
    [likes, dislikes]
  );

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("video")
        .select(
          `
          id,
          audiourl,
          created_at,
          description,
          dislikes,
          likes,
          lyrics,
          title,
          videourl,
          audiourl,
          views,
          profiles(
            username,
            avatar_url
          )
        `
        )
        .filter("id", "eq", vid);
      if (error) {
        console.log("error: ", error);
        return;
      } else {
        let { error } = await supabase
          .from("video")
          .update({ views: data[0].views + 1 })
          .eq("id", vid);

        data[0].views = data[0].views + 1;

        if (error) {
          console.log("error: ", error);
        }

        setVideoMediaData(data[0]);
        setLikes(data[0].likes);
        setDislikes(data[0].dislikes);
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
        <>
          <Video
            videoSource={videoMetaData.videourl}
            lyricsArr={videoMetaData.lyrics}
          />
          <div
            className="below-player-wrapper"
            style={{
              display: "flex",
              width: "clamp(100%, 95vw, 100%)",
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
                {videoMetaData.profiles.avatar_url !== undefined ? (
                  <Avatar
                    src={videoMetaData.profiles.avatar_url}
                    style={{ marginRight: "0.5rem" }}
                    radius="xl"
                    alt="no image here"
                  />
                ) : (
                  <Avatar
                    style={{ marginRight: "0.5rem" }}
                    radius="xl"
                    alt="no image here"
                  />
                )}
                <p style={{ margin: 0, marginRight: "0.5rem" }}>
                  {videoMetaData.profiles.username}
                </p>
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
                  onClick={() => handleLike(videoMetaData.id)}
                  style={{ marginRight: "0.25rem" }}
                  color="gray"
                  compact
                  size="md"
                  variant="light"
                  radius="xl"
                >
                  <AiFillLike color={liked ? "green" : "gray"} size={12} />
                  <p style={{ marginLeft: "0.5rem" }}>{likes}</p>
                </Button>
                <Button
                  onClick={() => handleDislike(videoMetaData.id)}
                  style={{ marginRight: "0.25rem" }}
                  color="gray"
                  compact
                  size="md"
                  variant="light"
                  radius="xl"
                >
                  <AiFillDislike color={disliked ? "red" : "gray"} size={12} />
                  <p style={{ marginLeft: "0.5rem" }}>{dislikes}</p>
                </Button>{" "}
              </div>
            </div>
            <Alert color="gray" style={{ width: "100%", marginBottom: "2rem" }}>
              <Spoiler maxHeight={50} showLabel="Show more" hideLabel="Hide">
                <p style={{ margin: 0 }}>Description:</p>
                <div style={{ marginTop: "0.25rem" }}>
                  {videoMetaData.description.split("\n").map((s) => {
                    return (
                      <>{s == "" ? <br /> : <p style={{ margin: 0 }}>{s}</p>}</>
                    );
                  })}
                </div>
              </Spoiler>
            </Alert>
            <Divider style={{ width: "100%" }} size="sm" />
            <Comments vid={videoMetaData.id} />
          </div>
        </>
      )}
    </div>
  );
}
