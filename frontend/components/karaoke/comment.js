import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { Avatar } from "@mantine/core";
import { Button } from "@mantine/core";
import { rectifyFormat } from "../../utils/formatUTC";
import { useState, useEffect, useCallback} from "react";

/* todo: 
  - recursive comments
  - format likes, dislikes and likes, dislike onclick
*/

function Comment({ props, updateLikes, updateDislikes }) {
  let { cid, content, created_at } = props;
  let { username, avatar_url } = props.profiles
  const [likes, setLikes] = useState(props.likes);
  const [dislikes, setDislikes] = useState(props.dislikes);
  const [liked, setLiked] = useState(false); // initial value depends on query
  const [disliked, setDisliked] = useState(false); // initial value depends on query

  const handleLike = useCallback(
    () => {
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
    },
    [cid, likes, dislikes]
  );

  const handleDislike = useCallback(
    () => {
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
    },
    [cid, likes, dislikes]
  );

  return (
    <div style={{ display: "flex", flexDirection: "row", marginBottom: "1rem" }}>
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
          <p style={{ fontWeight: "bold",marginBottom: 0, marginTop: 0, marginRight: "0.5rem" }}>
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
            size="sm"
            variant="light"
            radius="xl"
            on
          >
            <AiFillLike color={liked ? 'green' : 'gray'} size={12} />
            <p style={{ marginLeft: "0.5rem", color: liked ? 'green' : 'gray'}}>{likes}</p>
          </Button>
          <Button
            onClick={() => handleDislike()}
            style={{ marginRight: "0.25rem" }}
            color="gray"
            compact
            size="sm"
            variant="light"
            radius="xl"
          >
            <AiFillDislike color={disliked ? 'red' : 'gray'} size={12} />
            <p style={{marginLeft: "0.5rem", color: disliked ? 'red' : 'gray'}}>{dislikes}</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Comments({vid}) {
  const supabase = useSupabaseClient();
  const [commentData, setCommentData] = useState([])

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
        .select(`
          cid, 
          content,
          created_at,
          likes,
          dislikes,
          profiles(
            username,
            avatar_url
          )
        `)
        .filter("vid", "eq", vid)
        .order('likes', {ascending: false});
      if (error) {
        console.log("error: ", error);
        return;
      } else {
        setCommentData(data);
      }
    };

    if (vid) {
      fetchData();
    }
  }, [vid]);

  return (
    <>
      {commentData !== undefined && commentData.length !== 0 && (
      <>  
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "1.5rem",
            marginBottom: "1rem",
          }}
        >
        {commentData.length} Comments
      </p>
        {commentData.map((comment) => (
          <Comment key={comment.cid} props={comment} updateLikes={updateLikes} updateDislikes={updateDislikes}/>
        ))}
      </>)}
    </>
  );
}
