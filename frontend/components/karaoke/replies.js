import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Collapse } from "@mantine/core";
import { Button } from "@mantine/core";
import { useState, useEffect, useCallback, useMemo } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import Comment from "./comment";

export default function Replies({ vid, pid, sessionAvatarUrl }) {
  const supabase = useSupabaseClient();
  const [commentData, setCommentData] = useState([]);
  const [opened, setOpened] = useState(false);

  const uid = useMemo(() => {
    return "753b8a89-0624-4dd5-9592-89c664a806c3";
    // temp value until auth is finished
  }, []);

  const insertLikes = useCallback(
    async (rid) => {
      let { error } = await supabase
        .from("replyLikes")
        .insert({ uid: uid, rid: rid });

      if (error) {
        console.log("insert reply likes error: ", error);
      }
    },
    [uid]
  );

  const deleteLikes = useCallback(
    async (rid) => {
      let { error } = await supabase
        .from("replyLikes")
        .delete()
        .eq("uid", uid)
        .eq("rid", rid);

      if (error) {
        console.log("delete reply likes error: ", error);
      }
    },
    [uid]
  );

  const insertDislikes = useCallback(
    async (rid) => {
      let { error } = await supabase
        .from("replyDislikes")
        .insert({ uid: uid, rid: rid });

      if (error) {
        console.log("insert reply dislikes error: ", error);
      }
    },
    [uid]
  );

  const deleteDislikes = useCallback(
    async (rid) => {
      let { error } = await supabase
        .from("replyDislikes")
        .delete()
        .eq("uid", uid)
        .eq("rid", rid);

      if (error) {
        console.log("delete reply dislikes error: ", error);
      }
    },
    [uid]
  );

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
              <div
                key={`reply: ${comment.cid}`}
                style={{ marginBottom: "0.5rem" }}
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
        </div>
      ) : (
        <> </>
      )}
    </>
  );
}
