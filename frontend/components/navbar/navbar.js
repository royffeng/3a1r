import { Avatar, Button, Flex, Group, Input, Menu, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFilePerson } from "react-icons/bs";
import { MdOutlineLogout } from "react-icons/md";
import icon from "../../public/appicon.png";
import { UserContext } from "../../utils/UserContext";

export default function Navbar() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const userData = useContext(UserContext);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/signout");
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
            <Image width="40px" height="40px" src={icon} />
          </a>
        </Link>
        <Link href="/">
          <a
            style={{
              pointerEvents: "none",
              textDecoration: "none",
              color: "black",
            }}
          >
            My Playlists
          </a>
        </Link>
        <Link href="/">
          <a
            style={{
              pointerEvents: "none",
              textDecoration: "none",
              color: "black",
            }}
          >
            Settings
          </a>
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
      {userData ? (
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
      ) : (
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
          <Link href="/auth">Sign In</Link>
        </Button>
      )}
    </Flex>
  );
}
