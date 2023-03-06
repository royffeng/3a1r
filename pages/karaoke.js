import {
  Alert,
  Avatar,
  Button,
  Divider,
  Flex,
  Loader,
  Space,
  Spoiler,
  Text
} from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import "plyr/dist/plyr.css";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import Comments from "../components/karaoke/comments";
import Video from "../components/karaoke/video";
import { rectifyFormat } from "../utils/formatUTC";
import { UserContext } from "../utils/UserContext";

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
  const user = useContext(UserContext);

  const insertLikes = useCallback(async (uid, vid) => {
    let { error } = await supabase
      .from("videoLikes")
      .insert({ uid: uid, vid: vid });

    if (error) {
      console.log("insert video likes error: ", error);
    }
  }, []);

  const deleteLikes = useCallback(async (uid, vid) => {
    let { error } = await supabase
      .from("videoLikes")
      .delete()
      .eq("uid", uid)
      .eq("vid", vid);

    if (error) {
      console.log("delete video likes error: ", error);
    }
  }, []);

  const insertDislikes = useCallback(async (uid, vid) => {
    let { error } = await supabase
      .from("videoDislikes")
      .insert({ uid: uid, vid: vid });

    if (error) {
      console.log("insert video dislikes error: ", error);
    }
  }, []);

  const deleteDislikes = useCallback(async (uid, vid) => {
    let { error } = await supabase
      .from("videoDislikes")
      .delete()
      .eq("uid", uid)
      .eq("vid", vid);

    if (error) {
      console.log("delete video dislikes error: ", error);
    }
  }, []);

  const handleLike = useCallback((uid, vid, liked, disliked) => {
    if (disliked) {
      setDisliked(false);
      deleteDislikes(uid, vid);
      setDislikes((d) => d - 1);
    }
    if (liked) {
      setLiked(false);
      deleteLikes(uid, vid);
      setLikes((l) => l - 1);
    } else {
      setLiked(true);
      insertLikes(uid, vid);
      setLikes((l) => l + 1);
    }
  }, []);

  const handleDislike = useCallback((uid, vid, liked, disliked) => {
    if (liked) {
      setLiked(false);
      deleteLikes(uid, vid);
      setLikes((l) => l - 1);
    }
    if (disliked) {
      setDisliked(false);
      deleteDislikes(uid, vid);
      setDislikes((d) => d - 1);
    } else {
      setDisliked(true);
      insertDislikes(uid, vid);
      setDislikes((d) => d + 1);
    }
  }, []);

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
              avatar_url,
              id
            )
          `
        )
        .filter("id", "eq", vid);

      if (error) {
        console.log("error getting videos: ", error);
        return;
      } else {
        let d = data[0];
        if (!d.profiles.avatar_url.includes("https")) {
          let { data: avatar, error: error } = await supabase.storage
            .from("avatars")
            .download(`${d.profiles.avatar_url}`);
          if (error) {
            console.log(error);
          } else {
            const url = URL.createObjectURL(avatar);
            d.profiles.avatar_url = url;
          }
        }

        let { error } = await supabase
          .from("video")
          .update({ views: data[0].views + 1 })
          .eq("id", vid);

        data[0].views = data[0].views + 1;

        if (error) {
          console.log("error updating views for video: ", error);
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

  useEffect(() => {
    const setUserMetaData = async () => {
      let videoLikedData = await supabase
        .from("videoLikes")
        .select()
        .eq("uid", user.id)
        .eq("vid", vid);

      let videoDislikedData = await supabase
        .from("videoDislikes")
        .select()
        .eq("uid", user.id)
        .eq("vid", vid);

      setLiked(videoLikedData.data.length !== 0);
      setDisliked(videoDislikedData.data.length !== 0);
    };

    if (vid && user) {
      setUserMetaData();
    }
  }, [vid, user]);

  const dateString = useMemo(() => {
    if (videoMetaData) {
      return rectifyFormat(videoMetaData?.created_at).toLocaleDateString();
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
        padding: "5rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="pt-20"
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
            className="below-player-wrapper mt-2"
            style={{
              display: "flex",
              width: "clamp(100%, 95vw, 100%)",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <Text style={{ fontSize: "1.5rem" }}>{videoMetaData?.title}</Text>
            <Flex
              className="video-date-views"
              direction="row"
              justify="start"
              align="center"
              gap="sm"
            >
              <Text fz="md">{dateString}</Text>
              <Text fz="md">{videoViews} views</Text>
            </Flex>
            <Flex
              className="video-user"
              direction="row"
              justify="space-between"
              align="center"
              style={{
                width: "100%",
              }}
            >
              <Link href={`/user?id=${videoMetaData.profiles.id}`}>
                <Flex
                  direction="row"
                  align="center"
                  className="w-full py-3 hover:cursor-pointer"
                  gap="sm"
                >
                  {videoMetaData.profiles.avatar_url !== undefined ? (
                    <Avatar
                      src={videoMetaData.profiles.avatar_url}
                      radius="xl"
                      alt="no image here"
                    />
                  ) : (
                    <Avatar radius="xl" alt="no image here" />
                  )}
                  <Text>{videoMetaData.profiles.username}</Text>
                </Flex>
              </Link>
              <Flex
                className="video-likes-dislikes pt-0"
                direction="row"
                align="center"
                gap="xs"
              >
                <Button
                  onClick={() =>
                    handleLike(user.id, videoMetaData.id, liked, disliked)
                  }
                  leftIcon={
                    <AiFillLike color={liked ? "green" : "gray"} size={12} />
                  }
                  color="gray"
                  compact
                  size="md"
                  variant="light"
                  radius="xl"
                >
                  <Text>{likes}</Text>
                </Button>
                <Button
                  onClick={() =>
                    handleDislike(user.id, videoMetaData.id, liked, disliked)
                  }
                  leftIcon={
                    <AiFillDislike
                      color={disliked ? "red" : "gray"}
                      size={12}
                    />
                  }
                  color="gray"
                  compact
                  size="md"
                  variant="light"
                  radius="xl"
                >
                  <Text>{dislikes}</Text>
                </Button>
              </Flex>
            </Flex>
            <Alert color="gray" style={{ width: "100%" }}>
              <Spoiler maxHeight={50} showLabel="Show more" hideLabel="Hide">
                <Text fz="sm">Description:</Text>
                {videoMetaData.description.split("\n").map((s, i) => {
                  if (s == "") {
                    return <br key={i} />;
                  }
                  return (
                    <Text fz="sm" key={`description ${s}`}>
                      {s}
                    </Text>
                  );
                })}
              </Spoiler>
            </Alert>
            <Space h="xl" />
            <Divider style={{ width: "100%" }} size="sm" />
            <Comments vid={videoMetaData.id} />
            <Space h="xl" />
          </div>
        </>
      )}
    </div>
  );
}
