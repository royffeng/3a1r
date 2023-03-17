import { Button, Flex, Space, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { rectifyFormat } from "../../utils/formatUTC";
import { UserContext } from "../../utils/UserContext";
import AddReplyTextBox from "./AddReplyTextBox";
import UserAvatar from "./UserAvatar";

export default function Reply({
  pid,
  handleNewReply,
  replyData,
  insertLikes,
  insertDislikes,
  deleteLikes,
  deleteDislikes,
  sessionAvatarUrl,
}) {
  const supabase = useSupabaseClient();
  let { rid, content, created_at } = useMemo(() => {
    return replyData;
  }, [replyData]);
  let { username, avatar_url } = useMemo(() => {
    return replyData.profiles;
  }, [replyData]);
  const [likes, setLikes] = useState(replyData.likes);
  const [dislikes, setDislikes] = useState(replyData.dislikes);
  const [liked, setLiked] = useState(false); // initial value depends on query
  const [disliked, setDisliked] = useState(false); // initial value depends on query
  const [showAddReply, setShowAddReply] = useState(false);
  const user = useContext(UserContext);

  const handleLike = useCallback((uid, rid, liked, disliked) => {
    if (disliked) {
      setDisliked(false);
      deleteDislikes(uid, rid);
      setDislikes((d) => d - 1);
    }
    if (liked) {
      setLiked(false);
      deleteLikes(uid, rid);
      setLikes((l) => l - 1);
    } else {
      setLiked(true);
      insertLikes(uid, rid);
      setLikes((l) => l + 1);
    }
  }, []);

  const handleDislike = useCallback((uid, rid, liked, disliked) => {
    if (liked) {
      setLiked(false);
      deleteLikes(uid, rid);
      setLikes((l) => l - 1);
    }
    if (disliked) {
      setDisliked(false);
      deleteDislikes(uid, rid);
      setDislikes((d) => d - 1);
    } else {
      setDisliked(true);
      insertDislikes(uid, rid);
      setDislikes((d) => d + 1);
    }
  }, []);

  const closeReply = useCallback(() => {
    setShowAddReply(false);
  }, []);

  useEffect(() => {
    const getInitialRepliedLikedState = async () => {
      let replyLikedData = await supabase
        .from("replyLikes")
        .select()
        .eq("uid", user.id)
        .eq("rid", rid);

      let replyDisLikedData = await supabase
        .from("replyDislikes")
        .select()
        .eq("uid", user.id)
        .eq("rid", rid);

      if (replyLikedData.error) {
        console.log(
          "error getting initial reply liked state: ",
          replyLikedData.error
        );
      }

      if (replyDisLikedData.error) {
        console.log(
          "error getting initial reply disliked state: ",
          replyDisLikedData.error
        );
      }

      setLiked(replyLikedData.data.length !== 0);
      setDisliked(replyDisLikedData.data.length !== 0);
    };

    if (user && rid) {
      getInitialRepliedLikedState();
    }
  }, [user, rid]);

  return (
    <>
      <Flex direction="row" gap="md">
        <UserAvatar avatarUrl={avatar_url} />
        <Flex direction="column" sx={{ width: "100%" }}>
          <Flex direction="row" gap="sm">
            <Text fz="sm" fw={500}>
              {username}
            </Text>
            <Text
              fz="sm"
              style={{
                color: "gray",
              }}
            >
              {rectifyFormat(created_at).toLocaleDateString()}
            </Text>
          </Flex>
          <Text fz="sm" sx={{ marginBottom: "0.25rem" }}>
            {content}
          </Text>
          <Flex
            direction="row"
            wrap="wrap"
            align="center"
            justify="flex-start"
            gap="xs"
          >
            {user ? (
              <>
                <Button
                  onClick={() => handleLike(user.id, rid, liked, disliked)}
                  leftIcon={
                    <AiFillLike color={liked ? "green" : "gray"} size={12} />
                  }
                  color="gray"
                  compact
                  size="xs"
                  variant="light"
                  radius="xl"
                >
                  <Text
                    fz="xs"
                    sx={{
                      color: liked ? "green" : "gray",
                    }}
                  >
                    {likes}
                  </Text>
                </Button>
                <Button
                  onClick={() => handleDislike(user.id, rid, liked, disliked)}
                  leftIcon={
                    <AiFillDislike
                      color={disliked ? "red" : "gray"}
                      size={12}
                    />
                  }
                  color="gray"
                  compact
                  size="xs"
                  variant="light"
                  radius="xl"
                >
                  <Text
                    fz="xs"
                    style={{
                      color: disliked ? "red" : "gray",
                    }}
                  >
                    {dislikes}
                  </Text>
                </Button>
              </>
            ) : (
              <>
                <Button
                  leftIcon={
                    <AiFillLike color={liked ? "green" : "gray"} size={12} />
                  }
                  color="gray"
                  compact
                  size="xs"
                  variant="light"
                  radius="xl"
                  disabled
                >
                  <Text
                    fz="xs"
                    sx={{
                      color: liked ? "green" : "gray",
                    }}
                  >
                    {likes}
                  </Text>
                </Button>
                <Button
                  leftIcon={
                    <AiFillDislike
                      color={disliked ? "red" : "gray"}
                      size={12}
                    />
                  }
                  color="gray"
                  compact
                  size="xs"
                  variant="light"
                  radius="xl"
                  disabled
                >
                  <Text
                    fz="xs"
                    style={{
                      color: disliked ? "red" : "gray",
                    }}
                  >
                    {dislikes}
                  </Text>
                </Button>
              </>
            )}

            <Button
              onClick={() => {
                setShowAddReply(true);
              }}
              color="dark"
              compact
              size="xs"
              variant="subtle"
              radius="xl"
            >
              Reply
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {showAddReply && (
        <>
          <Space h="sm" />
          <Flex direction="column" sx={{ marginLeft: "3.375rem" }}>
            <AddReplyTextBox
              placeholder={"Add a reply..."}
              ogAuthor={username}
              type="Reply"
              pid={pid}
              avatar_url={sessionAvatarUrl}
              closeReply={closeReply}
              handleNewReply={handleNewReply}
            />
            <Space h="xs" />
          </Flex>
        </>
      )}
    </>
  );
}
