import { Avatar, Button, Flex, Group, Input, Menu, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilePerson } from "react-icons/bs";
import { MdOutlineLogout } from "react-icons/md";
import { TbVideoPlus } from "react-icons/tb";
import icon from "../public/appicon.png";
import { UserContext } from "../utils/UserContext";

export default function Navbar({ searchContext }) {
  useEffect(() => {
    console.log("first load");
  }, []);
  const router = useRouter();
  const supabase = useSupabaseClient();
  const userData = useContext(UserContext);
  const [search, setSearch] = useState("");

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  }, [supabase]);

  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
      style={{
        width: "100%",
        marginTop: "0.5rem",
        marginBottom: "2rem",
        padding: "10px",
      }}
      gap="xl"
    >
      <Flex direction="row" align="center" justify="center" gap="md">
        <Link href="/">
          <a style={{ display: "flex", alignItems: "center" }}>
            <Image width="40px" height="40px" src={icon} alt="Icon" />
          </a>
        </Link>
      </Flex>
      <Flex
        direction="row"
        sx={{
          flex: 1,
        }}
      >
        <form
          style={{ width: "100%" }}
          onSubmit={(e) => {
            e.preventDefault();
            searchContext(search);
            router.push(`/search?query=${search}`);
          }}
        >
          <Input
            stroke={1.5}
            variant="filled"
            size="md"
            radius="lg"
            icon={<AiOutlineSearch />}
            onChange={(e) => setSearch(e.currentTarget.value)}
            placeholder="Search for a song"
          />
        </form>
      </Flex>
      {userData ? (
        <>
          <Button size="md" leftIcon={<TbVideoPlus />} color="green">
            <Link href="/create">Create</Link>
          </Button>
          <Menu shadow="md" position="bottom-end">
            <Menu.Target>
              {userData?.avatarUrl !== undefined ? (
                <Avatar
                  sx={{ cursor: "pointer" }}
                  src={userData?.avatarUrl}
                  radius="xl"
                  alt="no image here"
                />
              ) : (
                <Avatar
                  sx={{ cursor: "pointer" }}
                  radius="xl"
                  alt="no image here"
                />
              )}
            </Menu.Target>

            <Menu.Dropdown sx={{ padding: "0.75rem" }}>
              <Group>
                {userData?.avatarUrl !== undefined ? (
                  <Avatar
                    sx={{ cursor: "pointer" }}
                    src={userData?.avatarUrl}
                    radius="xl"
                    alt="no image here"
                  />
                ) : (
                  <Avatar
                    sx={{ cursor: "pointer" }}
                    radius="xl"
                    alt="no image here"
                  />
                )}
                <div style={{ flex: 1 }}>
                  <Text>{userData.full_name}</Text>
                  <Text>@{userData.username}</Text>
                </div>
              </Group>
              <Menu.Divider color="red" />
              <Menu.Item
                component="a"
                href={`/profile?id=${userData.id}`}
                icon={<BsFilePerson size={20} />}
              >
                Your Profile
              </Menu.Item>
              <Menu.Item
                icon={<MdOutlineLogout size={20} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </>
      ) : (
        <Link href="/auth">
          <Button
            size="lg"
            leftIcon={
              <Avatar
                size="sm"
                variant="outline"
                color="dark"
                radius="xl"
                alt="no image here"
              />
            }
            variant="subtle"
            color="dark"
          >
            Sign In
          </Button>
        </Link>
      )}
    </Flex>
  );
}
