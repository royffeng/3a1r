import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const ID = () => {
  const router = useRouter();
  const { id } = router.query;

  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      let sid = ""
      if (id) {
        let { data, error } = await supabase
          .from("playlistHas")
          .select(
            `
            sid
          `
          )
          .filter("pid", "eq", id).limit(1);
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
        console.log(data)
        }
      }
    };

    fetchData();
  }, [id]);
  return <div className="pt-20">playlists</div>;
};

export default ID;
