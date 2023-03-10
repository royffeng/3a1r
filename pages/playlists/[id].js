import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const ID = () => {
  const router = useRouter();
  const { id } = router.query;

  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        let { data, error } = await supabase
          .from("playlistHas")
          .select(
          `
            id,
            pid, 
            sid
          `
          )
          .filter("id", "eq", id);
        if (error) {
          console.log("Error getting playlist songs data: ", error);
        } else {
          console.log(data);
        }
      }
    };

    fetchData();
  }, [id]);
  return <div className="pt-20">playlists</div>;
};

export default ID;
