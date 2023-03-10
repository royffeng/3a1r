import { Button, Flex, Space, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { rectifyFormat } from "../../utils/formatUTC";
import { UserContext } from "../../utils/UserContext";
import AddReplyTextBox from "./AddReplyTextBox";
import Replies from "./replies";
import UserAvatar from "./UserAvatar";
import { FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";

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
  let { cid, uid, content, created_at } = useMemo(() => {
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
  const [comment, setComment] = useState(content);
  const [edit, setEdit] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hover, setHover] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

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

  const handleUpdateComment = async () => {
    await supabase.from("comments").update({ content: comment }).eq("cid", cid);
    setEdit(false);
  };

  const handleDeleteComment = async () => {
    await supabase.from("comments").delete().eq("cid", cid);
    setVisible(false);
  };

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
    visible && (
      <>
        <div>
          <Flex direction="row" gap="md">
            <UserAvatar avatarUrl={avatar_url} />
            <Flex direction="column" sx={{ width: "100%" }}>
              <div
                className={`${
                  hover ? "!bg-micdrop-gray" : ""
                } hover:cursor-pointer p-2 rounded-xl ${
                  edit || confirmVisible ? "bg-micdrop-gray" : ""
                } `}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
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
                  <div className="w-full flex justify-end">
                    {uid === user.id && (
                      <>
                        {!edit && (
                          <FaPencilAlt
                            onClick={() => setEdit(true)}
                            className={`${
                              hover ? "inline" : "hidden"
                            } hover:text-gray-500 hover:cursor-pointer text-xl mx-2`}
                          />
                        )}
                        {!edit && (
                          <FaTimes
                            onClick={() => setConfirmVisible(true)}
                            className={`${
                              hover ? "inline" : "hidden"
                            } hover:text-red-500 text-xl hover:cursor-pointer mx-2`}
                          />
                        )}
                      </>
                    )}
                  </div>
                </Flex>

                <div className="flex font-lexend items-center">
                  <input
                    className={`w-full hover:cursor-pointer m-1 outline-none focus:ring-1 focus:ring-black  ${
                      edit
                        ? "text-black bg-white py-2 px-2 rounded-full"
                        : `text-black ${
                            hover || confirmVisible
                              ? "!bg-micdrop-gray"
                              : "bg-micdrop-beige"
                          }`
                    }`}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={!edit}
                  />
                  {edit && (
                    <FaCheck
                      onClick={handleUpdateComment}
                      className={`hover:text-green-500 hover:cursor-pointer text-xl mx-3`}
                    />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <Button
                      onClick={() => handleLike(user.id, cid, liked, disliked)}
                      leftIcon={
                        <AiFillLike
                          color={liked ? "green" : "gray"}
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
                        sx={{
                          color: liked ? "green" : "gray",
                        }}
                      >
                        {likes}
                      </Text>
                    </Button>
                    <Button
                      onClick={() =>
                        handleDislike(user.id, cid, liked, disliked)
                      }
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
                  </div>
                  {uid === user.id && confirmVisible && (
                    <div className="flex justify-center items-center font-lexend">
                      <p className="mb-0">delete comment?</p>
                      <div
                        className="px-2 hover:!font-bold"
                        onClick={handleDeleteComment}
                      >
                        yes
                      </div>
                      |
                      <div
                        className="px-2 hover:!font-bold"
                        onClick={() => setConfirmVisible(false)}
                      >
                        no
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Flex>
          </Flex>
        </div>
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
    )
  );
}
