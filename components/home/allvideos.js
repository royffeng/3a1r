import { Center, Flex, Space, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import styles from "./landing.module.css";
import { VideoGrid } from "./videoGrid";

const AllVideos = () => {
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
        .limit(8);
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
    <Flex justify="flex-start" align="flex-start" className={styles.category}>
      <Center className={styles.header} sx={{ background: "#E6E1FF" }}>
        <Text fz={32} fw={500}>
          All Videos
        </Text>
      </Center>
      <Space h={16} />
      <VideoGrid videos={videos} />
    </Flex>
  );
};

export default AllVideos;
