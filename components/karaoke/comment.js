import { Button, Flex, Space, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { rectifyFormat } from "../../utils/formatUTC";
import { UserContext } from "../../utils/UserContext";
import AddReplyTextBox from "./AddReplyTextBox";
import Replies from "./replies";
import UserAvatar from "./UserAvatar";

export default function Comment({
  commentData,
  vid,
  insertLikes,
  insertDislikes,
  deleteLikes,
  deleteDislikes,
  sessionAvatarUrl,
}) {
  const supabase = useSupabaseClient();
  let { cid, content, created_at } = useMemo(() => {
    return commentData;
  }, [commentData]);
  let { username, avatar_url } = useMemo(() => {
    return commentData.profiles;
  }, [commentData]);
  const [likes, setLikes] = useState(commentData.likes);
  const [dislikes, setDislikes] = useState(commentData.dislikes);
  const [liked, setLiked] = useState(false); // initial value depends on query
  const [disliked, setDisliked] = useState(false); // initial value depends on query
  const [showAddReply, setShowAddReply] = useState(false);
  const [replyDataArray, setReplyDataArray] = useState([]);
  const [avatarWait, setAvatarWait] = useState(true);
  const user = useContext(UserContext);

  const handleReplyData = useCallback((replyDataArray) => {
    setReplyDataArray(replyDataArray);
    setAvatarWait(false);
  }, []);

  const handleNewReply = useCallback((reply) => {
    setReplyDataArray((prev) => [...prev, reply]);
  }, []);

  const handleLike = useCallback((uid, cid, liked, disliked) => {
    if (disliked) {
      setDisliked(false);
      deleteDislikes(uid, cid);
      setDislikes((d) => d - 1);
    }
    if (liked) {
      setLiked(false);
      deleteLikes(uid, cid);
      setLikes((l) => l - 1);
    } else {
      setLiked(true);
      insertLikes(uid, cid);
      setLikes((l) => l + 1);
    }
  }, []);

  const handleDislike = useCallback((uid, cid, liked, disliked) => {
    if (liked) {
      setLiked(false);
      deleteLikes(uid, cid);
      setLikes((l) => l - 1);
    }
    if (disliked) {
      setDisliked(false);
      deleteDislikes(uid, cid);
      setDislikes((d) => d - 1);
    } else {
      setDisliked(true);
      insertDislikes(uid, cid);
      setDislikes((d) => d + 1);
    }
  }, []);

  const closeReply = useCallback(() => {
    setShowAddReply(false);
  }, []);

  useEffect(() => {
    const getInitalCommentLikedState = async () => {
      let commentLikedData = await supabase
        .from("commentLikes")
        .select()
        .eq("uid", user.id)
        .eq("cid", cid);

      let commentDislikedData = await supabase
        .from("commentDislikes")
        .select()
        .eq("uid", user.id)
        .eq("cid", cid);

      if (commentLikedData.error) {
        console.log(
          "error getting initial comment liked state: ",
          commentLikedData.error
        );
      }

      if (commentDislikedData.error) {
        console.log(
          "error getting initial comment disliked state: ",
          commentLikedData.error
        );
      }
      setLiked(commentLikedData.data.length !== 0);
      setDisliked(commentDislikedData.data.length !== 0);
    };

    if (vid && user && cid) {
      getInitalCommentLikedState();
    }
  }, [user, vid, cid]);

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
            <Button
              onClick={() => handleLike(user.id, cid, liked, disliked)}
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
              onClick={() => handleDislike(user.id, cid, liked, disliked)}
              leftIcon={
                <AiFillDislike color={disliked ? "red" : "gray"} size={12} />
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
              type="Reply"
              pid={cid}
              avatar_url={sessionAvatarUrl}
              closeReply={closeReply}
              handleNewReply={handleNewReply}
            />
            <Space h="xs" />
          </Flex>
        </>
      )}
      <Replies
        handleNewReply={handleNewReply}
        replyDataArray={replyDataArray}
        handleReplyData={handleReplyData}
        avatarWait={avatarWait}
        vid={vid}
        pid={cid}
        sessionAvatarUrl={sessionAvatarUrl}
      />
    </>
  );
}
