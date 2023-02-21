import { Flex, Space, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";
import styles from "../../styles/landing.module.css";
import { VideoGrid } from "./videoGrid";
import SegmentedControl from "./SegmentedControl";

const Genre = () => {
  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState(null);
  const [genres, setGenres] = useState(null);
  const [genre, setGenre] = useState(null);
  const user = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
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
            ),
            videoGenres(
                genre
            )
          `
        )
        .eq("videoGenres.genre", user.genres[0])
        .limit(4);
      if (error) {
        console.log(error);
        return;
      } else {
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

        for (let d of data) {
          d.videoGenres = d.videoGenres.map((g) => g.genre);
        }

        setVideos(data.filter((d) => d.videoGenres.length > 0));
        setGenres(user.genres.map((g) => ({ value: g, label: g })));
        setGenre(user.genres[0]);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleGenreChange = useCallback(async (value) => {
    setGenre(value);
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
            ),
            videoGenres(
                genre
            )
          `
      )
      .filter("title", "neq", null)
      .filter("videoGenres.genre", "eq", value)
      .limit(4);
    if (error) {
      console.log(error);
      return;
    } else {
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

      for (let d of data) {
        d.videoGenres = d.videoGenres.map((g) => g.genre);
      }

      setVideos(data.filter((d) => d.videoGenres.length > 0));
    }
  }, []);

  return (
    <>
      {user && (
        <>
          <Flex
            justify="flex-start"
            align="flex-start"
            className={styles.category}
          >
            <Text fz={32} fw={500}>
              Your Genres
            </Text>
            {genre && genres ? (
              <>
                {genre && genres && (
                  <SegmentedControl
                    values={genres}
                    handleValue={handleGenreChange}
                    value={genre}
                  />
                <Space h={4} />
                <VideoGrid videos={videos} />
              </>
            ) : (
              <>
                <Text aria-label="genre count" fz={16} fw={500}>
                  no liked genres
                </Text>
              </>
            )}
          </Flex>
          <Space h={48} />
        </>
      )}
    </>
  );
};

export default Genre;
