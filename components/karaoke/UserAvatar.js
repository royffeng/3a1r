import { Avatar } from "@mantine/core";

export default function UserAvatar({ avatarUrl }) {
  return (
    <>
      {avatarUrl !== undefined ? (
        <Avatar src={avatarUrl} radius="xl" alt="no image here" />
      ) : (
        <Avatar radius="xl" alt="no image here" />
      )}
    </>
  );
}
