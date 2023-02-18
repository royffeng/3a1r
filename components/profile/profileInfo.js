import { Avatar, Badge, Flex, Grid, Text } from "@mantine/core";
import React from "react";

const colors = [
  "bg-micdrop-green",
  "bg-micdrop-yellow",
  "bg-micdrop-pink",
  "bg-micdrop-purple",
]

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
                    <div
                      key={index}
                      className={`border-2 border-black px-4 py-2 font-semibold rounded-full ${colors[index % colors.length]} ${colors[index % colors.length] === "bg-micdrop-green" ? "!text-white" : "text-black"}`}
                      
                    >
                      {g}
                    </div>
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