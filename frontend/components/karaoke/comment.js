import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { Avatar } from "@mantine/core";
import { Button } from "@mantine/core";
import { rectifyFormat } from "../../utils/formatUTC";
import { useState, useCallback } from "react";
import Reply from "./reply";

export default function Comment({
  commentData,
  updateLikes,
  updateDislikes,
  sessionAvatarUrl,
}) {
  let { pid, cid, content, created_at } = commentData;
  let { username, avatar_url } = commentData.profiles;
  const [likes, setLikes] = useState(commentData.likes);
  const [dislikes, setDislikes] = useState(commentData.dislikes);
  const [liked, setLiked] = useState(false); // initial value depends on query
  const [disliked, setDisliked] = useState(false); // initial value depends on query
  const [showReply, setShowReply] = useState(false);

  const handleLike = useCallback(() => {
    if (disliked) {
      setDisliked(false);
      updateDislikes(cid, dislikes - 1);
      setDislikes((d) => d - 1);
    }
    if (liked) {
      setLiked(false);
      updateLikes(cid, likes - 1);
      setLikes((l) => l - 1);
    } else {
      setLiked(true);
      updateLikes(cid, likes + 1);
      setLikes((l) => l + 1);
    }
  }, [cid, likes, dislikes]);

  const handleDislike = useCallback(() => {
    if (liked) {
      setLiked(false);
      updateLikes(cid, likes - 1);
      setLikes((l) => l - 1);
    }
    if (disliked) {
      setDisliked(false);
      updateDislikes(cid, dislikes - 1);
      setDislikes((d) => d - 1);
    } else {
      setDisliked(true);
      updateDislikes(cid, dislikes + 1);
      setDislikes((d) => d + 1);
      // TODO SET UP LIKES / DISLIKES RELATION TABLE
    }
  }, [cid, likes, dislikes]);

  const closeReply = useCallback(() => {
    setShowReply(false);
  });

  return (
    <>
      <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
        <div>
          {avatar_url !== undefined ? (
            <Avatar
              src={avatar_url}
              style={{ marginRight: "1rem" }}
              radius="xl"
              alt="no image here"
            />
          ) : (
            <Avatar
              style={{ marginRight: "1rem" }}
              radius="xl"
              alt="no image here"
            />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "flex-start",
              marginBottom: "0.5rem",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 0,
                marginTop: 0,
                marginRight: "0.5rem",
              }}
            >
              {username}
            </p>
            <p
              style={{
                color: "gray",
                fontSize: "0.9rem",
                marginTop: 0,
                marginBottom: 0,
                marginRight: "0.5rem",
              }}
            >
              {rectifyFormat(created_at)}
            </p>
          </div>
          <p style={{ marginTop: 0, marginBottom: "0.5rem" }}>{content}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => handleLike()}
              style={{ marginRight: "0.25rem" }}
              color="gray"
              compact
              size="xs"
              variant="light"
              radius="xl"
            >
              <AiFillLike color={liked ? "green" : "gray"} size={12} />
              <p
                style={{
                  marginLeft: "0.5rem",
                  color: liked ? "green" : "gray",
                }}
              >
                {likes}
              </p>
            </Button>
            <Button
              onClick={() => handleDislike()}
              style={{ marginRight: "0.25rem" }}
              color="gray"
              compact
              size="xs"
              variant="light"
              radius="xl"
            >
              <AiFillDislike color={disliked ? "red" : "gray"} size={12} />
              <p
                style={{
                  marginLeft: "0.5rem",
                  color: disliked ? "red" : "gray",
                }}
              >
                {dislikes}
              </p>
            </Button>
            <Button
              onClick={() => {
                setShowReply(true);
              }}
              color="dark"
              size="xs"
              variant="subtle"
              radius="xl"
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
      {showReply ? (
        <div style={{ marginLeft: "3.375rem" }}>
          <Reply
            placeholder={"Add a reply..."}
            type="Reply"
            pid={pid !== undefined ? pid : cid}
            avatar_url={sessionAvatarUrl}
            closeReply={closeReply}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
