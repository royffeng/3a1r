import { Center, Flex, Space, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";
import styles from "./landing.module.css";
import { VideoGrid } from "./videoGrid";

export default function LikedVideos() {
  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState(null);
  const user = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("videoLikes")
        .select(
          `
            video:vid(
              id,
              title,
              thumbnail, 
              views,
              created_at,
              profiles(
                username,
                avatar_url
              )
            )
          `
        )
        .filter("uid", "eq", user.id)
        .limit(4);
      if (error) {
        console.log(error);
        return;
      } else {
        for (let i = 0; i < data.length; i++) {
          let d = data[i].video;
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
        setVideos(data.map((d) => d.video));
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <Flex justify="flex-start" align="flex-start" className={styles.category}>
      <Center className={styles.header} sx={{ background: "#FFE4ED" }}>
        <Text fz={32} fw={500}>
          Liked Videos
        </Text>
      </Center>
      <Space h={16} />
      <VideoGrid videos={videos} />
    </Flex>
  );
}
