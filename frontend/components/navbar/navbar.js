import { Avatar, Flex, Input } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { useEffect, useState, useMemo } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import icon from "../../public/appicon.png";

export default function Navbar() {
  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState("");
  const uid = useMemo(() => {
    return "753b8a89-0624-4dd5-9592-89c664a806c3";
    // temp value until auth is finished
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("profiles")
        .select(
          `
          avatar_url
        `
        )
        .filter("id", "eq", uid);

      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setAvatarUrl(data[0].avatar_url);
      }
    };
    if (uid) {
      fetchData();
    }
  }, [uid]);

  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
      style={{
        width: "100%",
        marginTop: "0.5rem",
        marginBottom: "2rem",
      }}
      gap="xl"
    >
      <Flex direction="row" align="center" justify="center" gap="md">
        <Link href="/">
          <a style={{ display: "flex", alignItems: "center" }}>
            <Image width="40px" height="40px" src={icon} />
          </a>
        </Link>
        <Link href="/">
          <a style={{ pointerEvents: "none" }}>My Playlists</a>
        </Link>
        <Link href="/">
          <a style={{ pointerEvents: "none" }}>Settings</a>
        </Link>
      </Flex>
      <Flex
        direction="row"
        sx={{
          flex: 1,
        }}
      >
        <Input
          disabled
          stroke={1.5}
          variant="filled"
          size="md"
          radius="lg"
          style={{ width: "100%" }}
          icon={<AiOutlineSearch />}
          placeholder="Search for a song"
        />
      </Flex>
      {avatarUrl !== undefined ? (
        <Avatar src={avatarUrl} radius="xl" alt="no image here" />
      ) : (
        <Avatar radius="xl" alt="no image here" />
      )}
    </Flex>
  );
}
