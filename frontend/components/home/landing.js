import { Space } from "@mantine/core";
import React from "react";
import AllVideos from "./allvideos";
import Genre from "./genre";
import LikedVideos from "./likedvideos";

const landing = () => {
  return (
    <>
      <LikedVideos />
      <Space h={48} />
      <AllVideos />
      <Space h={48} />
      <Genre />
    </>
  );
};

export default landing;
