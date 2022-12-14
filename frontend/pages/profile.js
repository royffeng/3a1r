import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Grid, Space, Text, Flex, Group, Avatar } from "@mantine/core";

const landing = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("profiles")
        .select(
          `
            avatar_url,
            username,
            full_name
            `
        )
        .filter("id", "eq", user.id);

      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setUserData({
          username: data[0].username,
          full_name: data[0].full_name,
        });
        if (!data[0].avatar_url.includes("https")) {
          let { data: avatar, error: error } = await supabase.storage
            .from("avatars")
            .download(`${data[0].avatar_url}`);
          if (error) {
            console.log(error);
          } else {
            const url = URL.createObjectURL(avatar);
            setAvatarUrl(url);
          }
        }
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className={styles.container}>
      <>
        {userData && (
          <Flex justify="flex-start" align="flex-start">
            <Group>
              {avatarUrl !== undefined ? (
                <Avatar
                  sx={{ cursor: "pointer" }}
                  src={avatarUrl}
                  size={300}
                  radius={300}
                  alt="no image here"
                />
              ) : (
                <Avatar
                  sx={{ cursor: "pointer" }}
                  radius="xl"
                  alt="no image here"
                />
              )}
              <div style={{ flex: 1 }}>
                <Text size={48}>{userData.full_name}</Text>
                <Text size={48}>@{userData.username}</Text>
              </div>
            </Group>
          </Flex>
        )}
      </>
    </div>
  );
};

export default landing;
