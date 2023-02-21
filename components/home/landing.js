import { Space } from "@mantine/core";
import React from "react";
import AllVideos from "./allvideos";
import Genre from "./genre";
import LikedVideos from "./likedvideos";

const landing = () => {
  return (
    <>
      <AllVideos />
      <LikedVideos />
      <Genre />
      <Space h={16} />
    </>
  );
};

export default landing;
