import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Avatar } from "@mantine/core";
import { Button } from "@mantine/core";
import { rectifyFormat } from "../../utils/formatUTC";
import { useState, useCallback, useEffect, useMemo } from "react";
import Reply from "./reply";

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
  let { pid, cid, content, created_at } = useMemo(() => {
    return commentData;
  }, [commentData]);
  let { username, avatar_url } = useMemo(() => {
    return commentData.profiles;
  }, [commentData]);
  const [likes, setLikes] = useState(commentData.likes);
  const [dislikes, setDislikes] = useState(commentData.dislikes);
  const [liked, setLiked] = useState(false); // initial value depends on query
  const [disliked, setDisliked] = useState(false); // initial value depends on query
  const [showReply, setShowReply] = useState(false);
  const uid = useMemo(() => {
    return "753b8a89-0624-4dd5-9592-89c664a806c3";
    // temp value until auth is finished
  }, []);

  useEffect(() => {
    const getInitialLikedState = async () => {
      if (pid !== null && pid !== undefined) {
        // reply
        let replyLikedData = await supabase
          .from("replyLikes")
          .select()
          .eq("uid", uid)
          .eq("rid", cid);

        let replyDisLikedData = await supabase
          .from("replyDislikes")
          .select()
          .eq("uid", uid)
          .eq("rid", cid);

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
      } else {
        // comment
        let commentLikedData = await supabase
          .from("commentLikes")
          .select()
          .eq("uid", uid)
          .eq("cid", cid);

        let commentDislikedData = await supabase
          .from("commentDislikes")
          .select()
          .eq("uid", uid)
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
      }
    };

    if (vid && uid) {
      getInitialLikedState();
    }
  }, [uid, pid, vid]);

  const handleLike = useCallback(() => {
    if (disliked) {
      setDisliked(false);
      deleteDislikes(cid);
      setDislikes((d) => d - 1);
    }
    if (liked) {
      setLiked(false);
      deleteLikes(cid);
      setLikes((l) => l - 1);
    } else {
      setLiked(true);
      insertLikes(cid);
      setLikes((l) => l + 1);
    }
  }, [cid, likes, dislikes]);

  const handleDislike = useCallback(() => {
    if (liked) {
      setLiked(false);
      deleteLikes(cid);
      setLikes((l) => l - 1);
    }
    if (disliked) {
      setDisliked(false);
      deleteDislikes(cid);
      setDislikes((d) => d - 1);
    } else {
      setDisliked(true);
      insertDislikes(cid);
      setDislikes((d) => d + 1);
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
