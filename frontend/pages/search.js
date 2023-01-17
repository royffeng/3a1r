import { Flex, Grid, SegmentedControl, Space } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { VideoGrid } from "../components/home/videoGrid";
import Playlist from "../components/profile/playlist";

export default function Search() {
  const router = useRouter();
  const [display, setDisplay] = useState("videos");
  const [playlists, setPlaylists] = useState(null);
  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState(null);
  const tabs = useMemo(() => {
    return [
      { value: "videos", label: "videos" },
      { value: "playlists", label: "playlists" },
    ];
  });

  useEffect(() => {
    const fetchVideoData = async () => {
      let { data, error } = await supabase
        .from("video")
        .select(
          `
            id,
            title,
            thumbnail, 
            views,
            created_at,
            profiles(
                username,
                avatar_url
            )
          `
        )
        .ilike("title", `%${router.query.query}%`);
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let d = data[i];
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
        }
        setVideos(data);
      }
    };

    const fetchPlaylistData = async () => {
      let { data, error } = await supabase
        .from("playlists")
        .select(
          `
          id, 
          created_at,
          profiles(
            username,
            avatar_url
          ),
          public,
          name,
          likes,
          thumbnail_url
        `
        )
        .filter("public", "eq", "true")
        .ilike("title", `%${router.query.query}%`);
      if (error) {
        console.log("error getting playlists: ", error);
        return;
      } else {
        setPlaylists(data);
      }
    };

    if (display === "videos") {
      fetchVideoData();
    }

    if (display === "playlists") {
      fetchPlaylistData();
    }
  }, [display]);

  return (
    <>
      <SegmentedControl
        value={display}
        onChange={(value) => setDisplay(value)}
        data={tabs}
        color="green"
      />
      <Space h={32} />
      {display === "videos" ? (
        <Flex
          justify="flex-start"
          align="flex-start"
          direction="column"
          sx={{ padding: "0 2rem" }}
        >
          <VideoGrid videos={videos} />
        </Flex>
      ) : display === "playlists" ? (
        <Flex
          justify="flex-start"
          align="flex-start"
          direction="column"
          sx={{ padding: "0 2rem" }}
        >
          <Grid gutter="md">
            {playlists?.map((playlist, index) => (
              <Grid.Col xs={4} sm={4} md={4} lg={3} key={index}>
                <Playlist playlistData={playlist} />
              </Grid.Col>
            ))}
          </Grid>
        </Flex>
      ) : null}

      <Space h={48} />
    </>
  );
}
