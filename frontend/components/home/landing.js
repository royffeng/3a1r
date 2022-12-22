import { Space } from "@mantine/core";
import React from "react";
import AllVideos from "./allvideos";
import Genre from "./genre";
import LikedVideos from "./likedvideos";

const landing = () => {
  return (
    <>
      <LikedVideos />
      <AllVideos />
      <Genre />
    </>
  );
};

export default landing;
