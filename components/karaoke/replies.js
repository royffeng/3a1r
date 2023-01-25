import { Button, Collapse, Flex, Space } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback, useEffect, useState } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import Comment from "./comment";

export default function Replies({ vid, pid, sessionAvatarUrl }) {
  const supabase = useSupabaseClient();
  const [commentData, setCommentData] = useState([]);
  const [opened, setOpened] = useState(false);
  const [avatarWait, setAvatarWait] = useState(true);

  const insertLikes = useCallback(async (uid, rid) => {
    let { error } = await supabase
      .from("replyLikes")
      .insert({ uid: uid, rid: rid });

    if (error) {
      console.log("insert reply likes error: ", error);
    }
  }, []);

  const deleteLikes = useCallback(async (uid, rid) => {
    let { error } = await supabase
      .from("replyLikes")
      .delete()
      .eq("uid", uid)
      .eq("rid", rid);

    if (error) {
      console.log("delete reply likes error: ", error);
    }
  }, []);

  const insertDislikes = useCallback(async (uid, rid) => {
    let { error } = await supabase
      .from("replyDislikes")
      .insert({ uid: uid, rid: rid });

    if (error) {
      console.log("insert reply dislikes error: ", error);
    }
  }, []);

  const deleteDislikes = useCallback(async (uid, rid) => {
    let { error } = await supabase
      .from("replyDislikes")
      .delete()
      .eq("uid", uid)
      .eq("rid", rid);

    if (error) {
      console.log("delete reply dislikes error: ", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("replies")
        .select(
          `
            pid,
            cid,
            content,
            created_at,
            likes,
            dislikes,
            profiles(
              username,
              avatar_url
            )
          `
        )
        .filter("pid", "eq", pid)
        .order("created_at", { ascending: true });
      if (error) {
        console.log("error: ", error);
        return;
      }
      if (error) {
        console.log("error getting comments: ", error);
        return;
      } else {
        for (let i = 0; i < data.length; i++) {
          let d = data[i];
          if (!d.profiles.avatar_url.includes("https")) {
            let { data: avatar, error: error } = await supabase.storage
              .from("avatars")
              .download(`${d.profiles.avatar_url}`);
            if (error) {
              console.log(error);
            } else {
              const url = URL.createObjectURL(avatar);
              d.profiles.avatar_url = url;
            }
          }
        }
        setCommentData(data);
      }

      setAvatarWait(false);
    };

    if (pid) {
      fetchData();
    }
  }, [pid]);

  return (
    <>
      {commentData !== undefined && commentData.length !== 0 && !avatarWait && (
        <Flex
          direction="column"
          className="reply"
          style={{ marginLeft: "3.375rem" }}
        >
          <Space h="sm" />
          <Flex>
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setOpened((o) => !o)}
              radius="xl"
              leftIcon={opened ? <GoChevronUp /> : <GoChevronDown />}
            >
              {commentData.length} replies
            </Button>
          </Flex>
          <Collapse in={opened}>
            <Space h="sm" />
            {commentData.map((comment) => (
              <div
                key={`reply: ${comment.cid}`}
                style={{ marginBottom: "0.5rem", width: "100%" }}
              >
                <Comment
                  commentData={comment}
                  vid={vid}
                  insertLikes={insertLikes}
                  insertDislikes={insertDislikes}
                  deleteLikes={deleteLikes}
                  deleteDislikes={deleteDislikes}
                  sessionAvatarUrl={sessionAvatarUrl}
                />
              </div>
            ))}
          </Collapse>
        </Flex>
      )}
    </>
  );
}
