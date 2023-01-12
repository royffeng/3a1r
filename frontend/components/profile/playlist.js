import { BackgroundImage, Flex, Image, Space, Text } from "@mantine/core";
import { useEffect } from "react";

const Playlist = ({ playlistData }) => {
  useEffect(() => {
    console.log(playlistData);
  }, []);
  return (
    <Flex
      bg="white"
      direction="column"
      justify="center"
      sx={{
        border: "solid black",
        padding: "1.5rem 1.5rem 3.5rem 1.5rem",
        borderRadius: "34px",
      }}
    >
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        <img
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            aspectRatio: "41 / 40",
            borderRadius: "25px",
          }}
          src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          alt="Random unsplash image"
        />
      </div>
      <Space h={8} />
      <Text lineClamp={1} truncate size={"md"}>{`${playlistData.name}`}</Text>
    </Flex>
  );
};

export default Playlist;
