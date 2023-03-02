import { Avatar, Button, Flex, Group, Menu, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState, useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineLogout, MdPerson } from "react-icons/md";
import icon from "../public/appicon.png";
import { UserContext } from "../utils/UserContext";
import { TbVideoPlus } from "react-icons/tb";


export default function Navbar({ searchContext }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const userData = useContext(UserContext);
  const [search, setSearch] = useState("");

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  }, []);

  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
      className="w-full py-3 px-8 fixed bg-micdrop-beige !z-[100000000]"
      gap="xl"
    >
      <Flex direction="row" align="center" justify="center" gap="md">
        <Link href="/">
          <div className="flex hover:cursor-pointer">
            <Image width="40px" height="40px" src={icon} alt="Icon" />
            <p className="font-lexend font-bold no-underline m-0 text-3xl pl-2">
              micDrop
            </p>
          </div>
        </Link>
      </Flex>

      {userData && (
        <>
        <Link href={`/profile?id=${userData.id}`}>
          <p className="m-0 font-lexend font-semibold hover:cursor-pointer text-lg hover:text-[#666666]">
            My Playlists
          </p>
        </Link>
        <Button className="bg-micdrop-green" size="md" leftIcon={<TbVideoPlus />} color="green">
          <Link href="/create">
            <p className="m-0">Create</p></Link>
        </Button>
        </>
      )}

      <Flex
        direction="row"
        sx={{
          flex: 1,
        }}
      >
        <form
          className="w-full flex justify-end items-center"
          onSubmit={(e) => {
            e.preventDefault();
            searchContext(search);
            router.push(`/search?query=${search}`);
          }}
        >
          <div className="flex justify-center items-center bg-white rounded-md">
            <AiOutlineSearch className="mx-2" />
            <input
              className="rounded-r-md py-2 outline-none font-lexend"
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="search songs/artists"
            />
          </div>
        </form>
      </Flex>
      {userData ? (
        <>
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

            <Menu.Dropdown
              sx={{ padding: "0.75rem" }}
              className="border-black border-2 shadow-none rounded-xl"
            >
              <Group>
                <div style={{ flex: 1 }}>
                  <Flex justify={"center"} align="center" gap="sm">
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
                    <div>
                      <Text>{userData?.full_name}</Text>
                      <Text>@{userData?.username}</Text>
                    </div>
                  </Flex>
                </div>
              </Group>
              <Menu.Divider color="black" />

              <Link href={`/profile?id=${userData?.id}`}>
                <div className="flex items-center hover:bg-white rounded p-1 hover:cursor-pointer">
                  <MdPerson className="text-lg mr-2" />
                  <p className="m-0">Profile</p>
                </div>
              </Link>

              <div
                className="flex items-center hover:bg-white rounded p-1 hover:cursor-pointer"
                onClick={handleLogout}
              >
                <MdOutlineLogout className="text-lg mr-2" />
                <p className="m-0">Logout</p>
              </div>
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
