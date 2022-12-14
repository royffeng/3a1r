import React, { useEffect, useState } from "react";
import styles from "./landing.module.css";
import Thumbnail from "../thumbnail/thumbnail";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Grid, Space, Text, Flex, Center } from "@mantine/core";
import LikedVideos from "./likedvideos";
import AllVideos from "./allvideos";

const landing = () => {
  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState(null);

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
            )
          `
        )
        .filter("title", "neq", null)
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

        setVideos(data);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <LikedVideos />
      <Space h={16} />
      <AllVideos />
    </>
  );
};

export default landing;
