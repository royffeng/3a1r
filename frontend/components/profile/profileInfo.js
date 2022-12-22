import { Avatar, Badge, Flex, Grid, Space, Text } from "@mantine/core";
import React from "react";
import styles from "../../styles/Home.module.css";

const ProfileInfo = ({ user }) => {
  return (
    <div className={styles.container}>
      <>
        {user ? (
          <Grid grow gutter={16} justify="flex-start" align="center">
            <Grid.Col sx={{ aspectRatio: "1 / 1" }} span={1}>
              {user.avatarUrl !== undefined ? (
                <Avatar
                  src={user.avatarUrl}
                  alt="no image here"
                  sx={{ width: "100%", height: "100%", borderRadius: "100%" }}
                />
              ) : (
                <Avatar
                  sx={{ cursor: "pointer" }}
                  radius="xl"
                  alt="no image here"
                />
              )}
            </Grid.Col>
            <Grid.Col span={1}>
              <Flex sx={{ width: "100%" }} direction="column" gap={4}>
                <Text
                  sx={{ width: "100%", fontSize: "clamp(1rem, 3vw, 3rem)" }}
                >
                  {user.full_name}
                </Text>
                <Text
                  sx={{ width: "100%", fontSize: "clamp(1rem, 3vw, 3rem)" }}
                >
                  @{user.username}
                </Text>
                <>
                  <Flex direction="row" gap={4}>
                    {user.genres.map((g) => (
                      <Badge
                        variant="gradient"
                        gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
                      >
                        {g}
                      </Badge>
                    ))}
                  </Flex>
                </>
              </Flex>
            </Grid.Col>
          </Grid>
        ) : (
          <>No User</>
        )}
      </>
    </div>
  );
};

export default ProfileInfo;
