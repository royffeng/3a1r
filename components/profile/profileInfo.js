import { Avatar, Flex, Grid, Button } from "@mantine/core";
import { Row, Col } from "react-bootstrap";
import React, { useState, useMemo } from "react";
import {GENRE_LIST} from "../../utils/genres"
import Genre from "../Signup/Genre"
import {RxUpdate} from "react-icons/rx"
import { AiOutlinePlusCircle } from "react-icons/ai";


const colors = [
  "bg-micdrop-green",
  "bg-micdrop-yellow",
  "bg-micdrop-pink",
  "bg-micdrop-purple",
];

const ProfileInfo = ({
  user,
  genres,
  self = true,
  isFollowing = false,
  setIsFollowing,
  handleFollow,
  updateGenres,
}) => {
  const [showGenreList, setShowGenreList] = useState(false);
  const genreList = useMemo(() => [...GENRE_LIST], [GENRE_LIST]);
  const [selectedGenres, setGenres] = useState(new Set([...user.genres]));
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
          <Grid.Col sx={{ aspectRatio: "1 / 1" }} span={2}>
            {user.avatarUrl !== undefined || user.avatar_url ? (
              <Avatar
                src={user.avatarUrl || user.avatar_url}
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
                {!self && (
                  <div className="max-w-full">
                    <Button
                      className="bg-micdrop-green"
                      radius="md"
                      onClick={() => {
                        handleFollow(isFollowing);
                        setIsFollowing(!isFollowing);
                      }}
                    >
                      {isFollowing ? "following" : "follow"}
                    </Button>
                  </div>
                )}
              </>
              <>
                <Flex className="mt-3 max-w-full" wrap="wrap" direction="row" gap={4}>
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
                    <Flex justify={"center"} align="center" className="mx-0 max-w-f">
                      <Button leftIcon={<AiOutlinePlusCircle style={{color: "white"}}/>} onClick={() => setShowGenreList(true)} radius="md" className="bg-micdrop-green" color="white">Add Genres</Button>
                    </Flex>
                </Flex>
                {
                  (showGenreList && (
                    <Row className="w-full m-0 p-0">
                    <>
                      {genreList.map((genre, index) => (
                        <Col
                          key={index}
                          className="m-0 p-0 w-fit flex justify-start !max-w-fit items-center"
                        >
                          <Genre genre={genre} isSelected={selectedGenres.has(genre)} setGenres={setGenres} />
                        </Col>
                      ))}
                      <div className="mx-0 max-w-f mt-2">
                        <Button onClick={() => {setShowGenreList(false); updateGenres(selectedGenres)}} leftIcon={<RxUpdate style={{color: "white"}}/>} radius="md" className="bg-micdrop-green" color="white">Update Genres</Button>
                      </div>
                    </>
                </Row>
                  ))
                }
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