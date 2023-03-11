import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Thumbnail from "../../components/thumbnail";

const ID = () => {
  const router = useRouter();
  const { id } = router.query;

  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let sid = "";
      let songs = 0;
      if (id) {
        let { data, error } = await supabase
          .from("playlistHas")
          .select(
            `
            sid
          `
          )
          .filter("pid", "eq", id);
        songs = data;
        console.log(songs);
        if (error) {
          console.log("Error getting playlist songs data: ", error);
        } else {
          for (let i = 0; i < songs.length; i++) {
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
            thumbnail,
            profiles(
              username,
              avatar_url,
              id
            )
          `
              )
              .filter("id", "eq", songs[i].sid);
            setVideos([...videos, data]);
          }
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="pt-20 px-4">
      {!loading &&
        videos.map((video, index) => (
          <Thumbnail
            key={index}
            id={video.id}
            username={"poggers"}
            title={video.title}
            views={video.views}
            thumbnail={video.thumbnail}
            avatar_url={video.profiles?.avatar_url}
            date={video.created_at}
            noDate={true}
            userid={video.profiles?.id}
          />
        ))}
    </div>
  );
};

export default ID;
