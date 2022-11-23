import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Comment from "./comment";
import { useState, useEffect, useCallback } from "react";
import Replies from "./replies";
import Reply from "./reply";

export default function Comments({ vid }) {
  const supabase = useSupabaseClient();
  const [commentData, setCommentData] = useState([]);
  const [avatarWait, setAvatarWait] = useState(true);
  const [avatar_url, setAvatarUrl] = useState("");

  const updateLikes = useCallback(async (cid, likes) => {
    let { error } = await supabase
      .from("comments")
      .update({ likes: likes })
      .eq("cid", cid);

    if (error) {
      console.log("error: ", error);
    }
  }, []);

  const updateDislikes = useCallback(async (cid, dislikes) => {
    let { error } = await supabase
      .from("comments")
      .update({ dislikes: dislikes })
      .eq("cid", cid);

    if (error) {
      console.log("error: ", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("comments")
        .select(
          `
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
        .filter("vid", "eq", vid)
        .order("likes", { ascending: false });
      if (error) {
        console.log("error: ", error);
        return;
      } else {
        setCommentData(data);
      }

      ({ data, error } = await supabase
        .from("profiles")
        .select(`avatar_url`)
        .filter("id", "eq", "753b8a89-0624-4dd5-9592-89c664a806c3"));

      if (error) {
        console.log("error: ", error);
        return;
      } else {
        setAvatarUrl(data[0].avatar_url);
      }
      setAvatarWait(false);
    };

    if (vid) {
      fetchData();
    }
  }, [vid]);

  return (
    <>
      {commentData !== undefined && commentData.length !== 0 && !avatarWait && (
        <div style={{ width: "100%" }}>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            {commentData.length} Comments
          </p>
          <Reply
            placeholder={"Add a comment..."}
            avatar_url={avatar_url}
            type="Comment"
            vid={vid}
            initialShowButtons={false}
          />
          {commentData.map((comment) => (
            <div
              key={comment.cid}
              className="comment"
              style={{ marginBottom: "1rem" }}
            >
              <Comment
                commentData={comment}
                updateLikes={updateLikes}
                updateDislikes={updateDislikes}
                sessionAvatarUrl={avatar_url}
              />
              <Replies
                key={`${comment.cid} replies`}
                pid={comment.cid}
                sessionAvatarUrl={avatar_url}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
