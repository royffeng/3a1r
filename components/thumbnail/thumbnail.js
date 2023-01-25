import React from "react";
import tn_styles from "./thumbnail.module.css";
import Link from "next/link";
import { Avatar, Text, Flex, Space, Image } from "@mantine/core";
import { rectifyFormat } from "../../utils/formatUTC";

const Thumbnail = ({
  id,
  title,
  username,
  views,
  thumbnail,
  avatar_url,
  date,
}) => {
  return (
    <Flex className={tn_styles.thumbnail}>
      <Flex direction="column">
        <Link target="_blank" href={`/karaoke?vid=${id}`}>
          <Image src={thumbnail} layout="fill" radius="md" alt="Thumbnail" />
        </Link>
        <Space h={8} />
        <Flex sx={{ paddingRight: "1rem" }} direction="row">
          {avatar_url !== undefined ? (
            <Avatar
              src={avatar_url}
              radius="xl"
              size="sm"
              alt="no image here"
            />
          ) : (
            <Avatar radius="xl" size="xs" alt="no image here" />
          )}
          <Space w={8} />
          <Flex direction="column">
            <Text fz="sm" fw={500}>
              {title}
            </Text>
            <Text fz="xs">{username}</Text>
            <Flex direction="row">
              <Text fz="xs">{`${views} views`}</Text>
              <Space w={8} />
              <Text fz="xs">{`${rectifyFormat(date)}`}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Thumbnail;
