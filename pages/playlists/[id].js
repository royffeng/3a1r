import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Thumbnail from "../../components/thumbnail";

const ID = () => {
  const router = useRouter();
  const { id } = router.query;

  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let sid = "";
      if (id) {
        let { data, error } = await supabase
          .from("playlistHas")
          .select(
            `
            sid
          `
          )
          .filter("pid", "eq", id)
          .limit(1);
        sid = data[0].sid;
        if (error) {
          console.log("Error getting playlist songs data: ", error);
        } else {
          let { data, error } = await supabase
            .from("video")
            .select(
              `
            id,
            audiourl,
            created_at,
            description,
            dislikes,
            likes,
            lyrics,
            title,
            videourl,
            audiourl,
            views,
            profiles(
              username,
              avatar_url,
              id
            )
          `
            )
            .filter("id", "eq", sid);
          console.log(data);
          setVideos(data);
        }
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="pt-20 px-4">
      {videos.map((video) => (
        // {
        //   console.log(video);
        //   console.log(video.id)
        // }
        <Thumbnail
          id={video.id}
          username={video.profiles.username}
          title={video.title}
          views={video.views}
          thumbnail={video.video_url}
          avatar_url={video.profiles.avatar_url}
          date={video.created_at}
          userid={video.profiles.id}
        />
      ))}
    </div>
  );
};

export default ID;
