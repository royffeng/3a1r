import {
  Flex,
  Image,
  Space,
  Text,
} from "@mantine/core";
import { AiFillHeart } from "react-icons/ai";

const Playlist = ({ playlistData }) => {
  return (
    <Flex
      bg="white"
      direction="column"
      justify="center"
      sx={{
        border: "solid black",
        padding: "1.5rem",
        height: "100%",
        borderRadius: "34px",
      }}
    >
      <Image
        radius="lg"
        sx={{
          maxHeight: "100%",
          maxWidth: "100%",
          aspectRatio: "41 / 40",
          objectFit: "cover",
        }}
        src={`${playlistData.thumbnail_url}`}
        alt="playlist thumbnail image"
      />
      <Space h={16} />
      <Text lineClamp={1} truncate size={"md"}>{`${playlistData.name}`}</Text>
      <Space h={28} />
      <Flex justify={"flex-end"}>
        <Flex justify="center" align="center" gap="xs">
          <AiFillHeart />
          <Text>{`${playlistData.likes}`}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Playlist;
