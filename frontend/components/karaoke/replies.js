import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Collapse } from "@mantine/core";
import { Button } from "@mantine/core";
import { useState, useEffect, useCallback } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import Comment from "./comment";

export default function Replies({ pid, sessionAvatarUrl }) {
  const supabase = useSupabaseClient();
  const [commentData, setCommentData] = useState([]);
  const [opened, setOpened] = useState(false);

  const updateLikes = useCallback(async (id, likes) => {
    let { error } = await supabase
      .from("replies")
      .update({ likes: likes })
      .eq("cid", id);

    if (error) {
      console.log("error: ", error);
    }
  }, []);

  const updateDislikes = useCallback(async (id, dislikes) => {
    let { error } = await supabase
      .from("replies")
      .update({ dislikes: dislikes })
      .eq("cid", id);

    if (error) {
      console.log("error: ", error);
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
      } else {
        setCommentData(data);
      }
    };

    if (pid) {
      fetchData();
    }
  }, [pid]);

  return (
    <>
      {commentData !== undefined && commentData.length !== 0 ? (
        <div className="reply" style={{ marginLeft: "3.375rem" }}>
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setOpened((o) => !o)}
            radius="xl"
            leftIcon={opened ? <GoChevronUp /> : <GoChevronDown />}
          >
            {commentData.length} replies
          </Button>
          <Collapse in={opened}>
            {commentData.map((comment) => (
              <div key={comment.cid} style={{ marginBottom: "0.5rem" }}>
                <Comment
                  commentData={comment}
                  updateLikes={updateLikes}
                  updateDislikes={updateDislikes}
                  sessionAvatarUrl={sessionAvatarUrl}
                />
              </div>
            ))}
          </Collapse>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
}
