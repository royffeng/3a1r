import { Grid, Space } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { VideoGrid } from "../components/home/videoGrid";
import Playlist from "../components/profile/playlist";
import Toggle from "../components/Toggle";
import Navbar from "../components/navbar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default function Search({ searchContext, search, ...props }) {
  // const router = useRouter();
  const [display, setDisplay] = useState("videos");
  const [playlists, setPlaylists] = useState(null);
  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      setDataLoading(true);
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
        .ilike("title", `%${search}%`);
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
      setDataLoading(false);
    };

    const fetchPlaylistData = async () => {
      console.log("search", search);
      setDataLoading(true);
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
        .ilike("name", `%${search}%`);
      if (error) {
        console.log("error getting playlists: ", error);
        return;
      } else {
        console.log("data", data);
        setPlaylists(data);
      }
      setDataLoading(false);
    };

    if (display === "videos") {
      fetchVideoData();
    }

    if (display === "playlists") {
      fetchPlaylistData();
    }
  }, [display, search]);

  return (
    <>
      <Navbar searchContext={searchContext} />
      <div className="flex justify-center items-start flex-col px-4 pt-20">
        <Toggle handleValue={setDisplay} value={display} />
        <Space h={32} />
        {!dataLoading && display === "videos" ? (
          <VideoGrid videos={videos} />
        ) : !dataLoading && display === "playlists" ? (
          <Grid gutter="md">
            {playlists?.map((playlist, index) => (
              <Grid.Col xs={4} sm={4} md={4} lg={3} key={index}>
                <Playlist playlistData={playlist} />
              </Grid.Col>
            ))}
          </Grid>
        ) : null}

        <Space h={48} />
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
