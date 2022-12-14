import { Flex, Space, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";
import Comment from "./comment";
import Replies from "./replies";
import Reply from "./reply";

export default function Comments({ vid }) {
  const supabase = useSupabaseClient();
  const [commentData, setCommentData] = useState(null);
  const [avatarWait, setAvatarWait] = useState(true);
  const user = useContext(UserContext);

  const insertLikes = useCallback(async (uid, cid) => {
    let { error } = await supabase
      .from("commentLikes")
      .insert({ uid: uid, cid: cid });

    if (error) {
      console.log("insert comment likes error: ", error);
    }
  }, []);

  const deleteLikes = useCallback(async (uid, cid) => {
    let { error } = await supabase
      .from("commentLikes")
      .delete()
      .eq("uid", uid)
      .eq("cid", cid);

    if (error) {
      console.log("delete comment likes error: ", error);
    }
  }, []);

  const insertDislikes = useCallback(async (uid, cid) => {
    let { error } = await supabase
      .from("commentDislikes")
      .insert({ uid: uid, cid: cid });

    if (error) {
      console.log("insert comment dislikes error: ", error);
    }
  }, []);

  const deleteDislikes = useCallback(async (uid, cid) => {
    let { error } = await supabase
      .from("commentDislikes")
      .delete()
      .eq("uid", uid)
      .eq("cid", cid);

    if (error) {
      console.log("delete comment dislikes error: ", error);
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

    if (vid) {
      fetchData();
    }
  }, [vid]);

  return (
    <>
      {commentData !== null && commentData !== undefined && !avatarWait && (
        <Flex direction="column" style={{ width: "100%" }}>
          <Text
            fz="xl"
            style={{
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {commentData.length} Comments
          </Text>
          <Reply
            placeholder={"Add a comment..."}
            avatar_url={user.avatarUrl}
            type="Comment"
            vid={vid}
            initialShowButtons={false}
          />
          <Space h="xl" />
          {commentData.map((comment) => (
            <div key={comment.cid}>
              <Flex
                direction="column"
                key={`comment: ${comment.cid}`}
                className="comment"
              >
                <Comment
                  commentData={comment}
                  vid={vid}
                  insertLikes={insertLikes}
                  insertDislikes={insertDislikes}
                  deleteLikes={deleteLikes}
                  deleteDislikes={deleteDislikes}
                  sessionAvatarUrl={user.avatarUrl}
                />
                <Replies
                  key={`${comment.cid} replies`}
                  vid={vid}
                  pid={comment.cid}
                  sessionAvatarUrl={user.avatarUrl}
                />
              </Flex>
              <Space h="lg" />
            </div>
          ))}
        </Flex>
      )}
    </>
  );
}
