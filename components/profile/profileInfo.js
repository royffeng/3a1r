import { Avatar, Badge, Flex, Grid, Text } from "@mantine/core";
import React from "react";

const ProfileInfo = ({ user }) => {
  return (
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
          <Grid.Col span={8}>
            <Flex sx={{ width: "100%" }} direction="column" gap={4}>
              <Text sx={{ width: "100%", fontSize: "clamp(1rem, 3vw, 3rem)" }}>
                {user.full_name}
              </Text>
              <Text
                sx={{ width: "100%", fontSize: "clamp(0.5rem, 1.5vw, 1.5rem)" }}
              >
                @{user.username}
              </Text>
              <>
                <Flex direction="row" gap={4}>
                  {user.genres.map((g, index) => (
                    <Badge
                      key={index}
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
  );
};

export default ProfileInfo;
