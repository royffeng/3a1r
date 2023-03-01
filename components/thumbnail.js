import React from "react";
import tn_styles from "../styles/thumbnail.module.css";
import Link from "next/link";
import { Avatar, Text, Flex, Space, Image } from "@mantine/core";
import { rectifyFormat } from "../utils/formatUTC";

const Thumbnail = ({
  id,
  title,
  username,
  views,
  thumbnail,
  avatar_url,
  date,
  userid,
}) => {
  if (username === null || username === undefined) {
    return <></>;
  }

  return (
    <Flex aria-label="video thumbnail" className={tn_styles.thumbnail}>
      <Flex direction="column">
        <Link target="_blank" href={`/karaoke?vid=${id}`}>
          <Image src={thumbnail} layout="fill" radius="md" alt="Thumbnail" />
        </Link>
        <Space h={8} />
        <Flex sx={{ paddingRight: "1rem" }} direction="row">
          <Link href={`/user?id=${userid}`}>
            {avatar_url !== undefined ? (
              <Avatar
                aria-label="avatar of user who created this video"
                src={avatar_url}
                radius="xl"
                size="md"
                alt="no image here"
              />
            ) : (
              <Avatar
                aria-label="avatar of user who created this video"
                radius="xl"
                size="md"
                alt="no image here"
              />
            )}
          </Link>
          <Space w={8} />
          <Link href={`/karaoke?vid=${id}`}>
            <Flex direction="column" className="w-full">
              <Text fz="sm" fw={600}>
                {title}
              </Text>
              <div className="flex justify-center items-start flex-col w-full">
                <Text fz="xs">{username}</Text>
                <div className="flex justify-between items-center !w-full">
                  <Text aria-label="video views" fz="xs">{`${views} view${
                    views == 1 ? "" : "s"
                  }`}</Text>
                  <Space w={8} />
                  <Text aria-label="date of video" fz="xs">{`${rectifyFormat(
                    date
                  )}`}</Text>
                </div>
              </div>
            </Flex>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Thumbnail;
