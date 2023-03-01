import React from "react";
import tn_styles from "../styles/thumbnail.module.css";
import Link from "next/link";
import { Avatar, Text, Flex, Space, Image } from "@mantine/core";
import { rectifyFormat } from "../utils/formatUTC";
import { GoPrimitiveDot } from "react-icons/go";

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
                <div className="flex justify-start items-center !w-full">
                  <Text aria-label="video views" fz="xs">{`${views} view${
                    views == 1 ? "" : "s"
                  }`}</Text>
                  <GoPrimitiveDot className="text-[.5rem] mx-1" />
                  <Text aria-label="date of video" fz="xs">
                    Posted{" "}
                    {`${Math.trunc(
                      Math.round(
                        new Date().getTime() - rectifyFormat(date).getTime()
                      ) /
                        (1000 * 3600 * 24)
                    )}`}{" "}
                    days ago
                  </Text>
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
