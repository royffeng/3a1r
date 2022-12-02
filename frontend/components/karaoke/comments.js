import { Flex, Space, Text } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Comment from "./comment";
import Replies from "./replies";
import Reply from "./reply";

export default function Comments({ vid }) {
  const supabase = useSupabaseClient();
  const [commentData, setCommentData] = useState(null);
  const [avatarWait, setAvatarWait] = useState(true);
  const [avatar_url, setAvatarUrl] = useState("");
  const uid = useMemo(() => {
    return "753b8a89-0624-4dd5-9592-89c664a806c3";
    // temp value until auth is finished
  }, []);

  const insertLikes = useCallback(
    async (cid) => {
      let { error } = await supabase
        .from("commentLikes")
        .insert({ uid: uid, cid: cid });

      if (error) {
        console.log("insert comment likes error: ", error);
      }
    },
    [uid]
  );

  const deleteLikes = useCallback(
    async (cid) => {
      let { error } = await supabase
        .from("commentLikes")
        .delete()
        .eq("uid", uid)
        .eq("cid", cid);

      if (error) {
        console.log("delete comment likes error: ", error);
      }
    },
    [uid]
  );

  const insertDislikes = useCallback(
    async (cid) => {
      let { error } = await supabase
        .from("commentDislikes")
        .insert({ uid: uid, cid: cid });

      if (error) {
        console.log("insert comment dislikes error: ", error);
      }
    },
    [uid]
  );

  const deleteDislikes = useCallback(
    async (cid) => {
      let { error } = await supabase
        .from("commentDislikes")
        .delete()
        .eq("uid", uid)
        .eq("cid", cid);

      if (error) {
        console.log("delete comment dislikes error: ", error);
      }
    },
    [uid]
  );

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

      ({ data, error } = await supabase
        .from("profiles")
        .select(`avatar_url`)
        .filter("id", "eq", uid));

      if (error) {
        console.log("error getting user profile: ", error);
        return;
      } else {
        setAvatarUrl(data[0].avatar_url);
      }
      setAvatarWait(false);
    };

    if (vid && uid) {
      fetchData();
    }
  }, [vid, uid]);

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
            avatar_url={avatar_url}
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
                  sessionAvatarUrl={avatar_url}
                />
                <Replies
                  key={`${comment.cid} replies`}
                  vid={vid}
                  pid={comment.cid}
                  sessionAvatarUrl={avatar_url}
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
