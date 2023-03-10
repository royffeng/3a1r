import { Avatar } from "@mantine/core";

export default function UserAvatar({ avatarUrl }) {
  return (
    <div>
      {avatarUrl !== undefined ? (
        <Avatar src={avatarUrl} radius="xl" alt="no image here" />
      ) : (
        <Avatar radius="xl" alt="no image here" />
      )}
    </div>
  );
}
