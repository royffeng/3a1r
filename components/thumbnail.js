import React, { useContext, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import tn_styles from "../styles/thumbnail.module.css";
import Link from "next/link";
import { Avatar, Text, Flex, Space, Image, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbPlus } from "react-icons/tb";
import { rectifyFormat } from "../utils/formatUTC";
import { GoPrimitiveDot } from "react-icons/go";
import { UserContext } from "../utils/UserContext";
import { Checkbox } from "@mantine/core";

const Thumbnail = ({
  id,
  title,
  username,
  views,
  thumbnail,
  avatar_url,
  date,
  userid,
  noDate = false,
  redirect = true,
}) => {
  const supabase = useSupabaseClient();
  const user = useContext(UserContext);
  const [value, setValue] = useState([]);
  const [initialValues, setInitialValues] = useState(new Set([]));
  const [playlists, setPlaylists] = useState(playlists);
  const [opened, { open, close }] = useDisclosure(false);
  if (username === null || username === undefined) {
    return <></>;
  }

  const handleOpen = async (uid) => {
    let playlists = await getPlaylists(uid);
    setPlaylists(playlists);
    open();
  };

  const getPlaylists = async (uid) => {
    let { data: playlists, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("uid", uid);
    if (error) {
      console.log("error getting playlists", error);
    } else {
      let currValue = [];
      for (let i = 0; i < playlists.length; i++) {
        let { data: exists, error } = await supabase
          .from("playlistHas")
          .select("*")
          .eq("pid", playlists[i].id)
          .eq("sid", id);
        if (error) {
          console.log("error getting pid", error);
        } else {
          playlists[i].exists = exists.length > 0;
          if (!playlists[i].exists) currValue.push(`${playlists[i].id}`);
        }
      }
      setValue(currValue);
      setInitialValues(new Set([...currValue]));
      return playlists;
    }
  };

  const handleSaveToPlaylist = async (sid, pids, initialValues) => {
    console.log(
      pids
        .filter((p) => {
          return initialValues.has(p);
        })
        .map((pid) => ({ pid: Number(pid), sid: sid }))
    );

    let { data: playlists, error } = await supabase
      .from("playlistHas")
      .insert(
        pids
          .filter((p) => {
            return initialValues.has(p);
          })
          .map((pid) => ({ pid: Number(pid), sid: sid }))
      )
      .select("*");
    if (error) {
      console.log("error inserting playlist", playlists);
    }
    close();
  };

  return (
    <Flex
      aria-label="video thumbnail"
      className={`${tn_styles.thumbnail} !z-0`}
    >
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={"Add to a Playlist"}
        color="black"
      >
        <Checkbox.Group value={value} onChange={setValue}>
          <Flex direction={"column"} gap="md">
            {playlists ? (
              <>
                {playlists.map((p, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-start items-center"
                    >
                      <input
                        type="checkbox"
                        key={p.id}
                        value={`${p.id}`}
                        className="accent-black text-black mx-2"
                      />
                      <label>{p.name}</label>
                    </div>
                  );
                })}
              </>
            ) : (
              <Text>No playlists to add to</Text>
            )}
            <button
              className="bg-micdrop-green text-white rounded px-3 py-2 font-lexend font-semibold hover:!bg-black"
              onClick={() => {
                handleSaveToPlaylist(id, value, initialValues);
              }}
            >
              Save to Playlists
            </button>
          </Flex>
        </Checkbox.Group>
      </Modal>
      <Flex direction="column">
        <Link target="_blank" href={redirect ? `/karaoke?vid=${id}` : ""}>
          <Image src={thumbnail} layout="fill" radius="md" alt="Thumbnail" />
        </Link>
        <Space h={8} />
        <Flex sx={{ paddingRight: "0.5rem" }} direction="row">
          <Link href={redirect ? `/user?id=${userid}` : ""}>
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
          <Link href={redirect ? `/karaoke?vid=${id}` : ""}>
            <Flex direction="column" className="w-full">
              <Text fz="sm" fw={600}>
                {title}
              </Text>
              <div className="flex justify-center items-start flex-col w-full">
                <p className="m-0 text-xs text-gray-900" fz="xs">
                  {username}
                </p>
                <div className="flex justify-start items-center !w-full">
                  <p
                    className="m-0 text-xs text-gray-900"
                    aria-label="video views"
                    fz="xs"
                  >{`${views} view${views == 1 ? "" : "s"}`}</p>
                  <GoPrimitiveDot className="text-[.5rem] mx-1" />
                  {!noDate && (
                    <p
                      className="m-0 text-xs text-gray-900"
                      aria-label="date of video"
                      fz="xs"
                    >
                      Posted{" "}
                      {`${Math.trunc(
                        Math.round(
                          new Date().getTime() - rectifyFormat(date).getTime()
                        ) /
                          (1000 * 3600 * 24)
                      )}`}{" "}
                      days ago
                    </p>
                  )}
                </div>
              </div>
            </Flex>
          </Link>
          <Flex>
            <TbPlus
              className="hover:bg-white rounded p-1 text-2xl"
              onClick={() => {
                handleOpen(user.id);
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Thumbnail;
