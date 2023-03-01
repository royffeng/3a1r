import { Avatar, Flex, Grid } from "@mantine/core";
import React from "react";

const colors = [
  "bg-micdrop-green",
  "bg-micdrop-yellow",
  "bg-micdrop-pink",
  "bg-micdrop-purple",
];

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
          <Grid.Col span={8} className="mx-2">
            <Flex sx={{ width: "100%" }} direction="column" gap={4}>
              <p className="text-5xl font-bold">{user.full_name}</p>
              <p className="text-3xl font-medium">@{user.username}</p>
              <>
                <Flex direction="row" gap={4}>
                  {console.log(user.genres)}
                  {user.genres?.map((g, index) => (
                    <div
                      key={index}
                      className={`border-2 border-black px-4 py-2 font-semibold rounded-full ${
                        colors[index % colors.length]
                      } ${
                        colors[index % colors.length] === "bg-micdrop-green"
                          ? "!text-white"
                          : "text-black"
                      }`}
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
