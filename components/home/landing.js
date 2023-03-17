import { Space } from "@mantine/core";
import React from "react";
import AllVideos from "./allvideos";
import Genre from "./genre";
import LikedVideos from "./likedvideos";

const landing = () => {
  return (
    <div className="mt-20 flex flex-col">
      <AllVideos />
      <LikedVideos />
      <Genre />
      <Space h={16} />
    </div>
  );
};

export default landing;
