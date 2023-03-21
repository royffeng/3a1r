import { Avatar, Flex, Grid, Button } from "@mantine/core";
import { useState } from "react";
import React from "react";

const colors = [
  "bg-micdrop-green",
  "bg-micdrop-yellow",
  "bg-micdrop-pink",
  "bg-micdrop-purple",
];

const ProfileInfo = ({ user, genres, self=true, friends=false, handleAddFriend}) => {
  const [isFriends, setIsFriends] = useState(friends)

  return (
    <div className="">
      {user ? (
        <Grid
          grow
          gutter={16}
          justify="flex-start"
          align="center"
          className="pt-20"
        >
          <Grid.Col sx={{ aspectRatio: "1 / 1" }} span={1}>
            {user.avatarUrl !== undefined ? (
              <Avatar
                src={user.avatarUrl}
                alt="no image here"
                sx={{ width: "100%", height: "100%", borderRadius: "100%" }}
              />
            ) : (
              <Avatar
                radius="xl"
                alt="no image here"
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  borderRadius: "100%",
                }}
              />
            )}
          </Grid.Col>
          <Grid.Col span={8} className="mx-2">
            <Flex sx={{ width: "100%" }} direction="column" gap={4}>
              <p className="text-5xl font-bold">{user.full_name}</p>
              <p className="text-3xl font-medium">@{user.username}</p>
              <>
                <Flex direction="row" gap={4} wrap="wrap">
                  {genres &&
                    genres.map((g, index) => (
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
                  {user.genres &&
                    user.genres.map((g, index) => (
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
              <>
              {!self && (
                <div marg>
                  <Button className="bg-micdrop-green mt-2" radius="md" sx={{maxWidth: "100%"}}
                  onClick={() => {
                    handleAddFriend(isFriends, setIsFriends)
                  }}>
                  {isFriends ? "following" : "follow"}
                </Button>
                </div>
              )}
              </>
            </Flex>
          </Grid.Col>
        </Grid>
      ) : (
        <>No User</>
      )}
    </div>
  );
};

export default ProfileInfo;
