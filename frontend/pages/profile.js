import React, { useState, useContext, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Playlists from "../components/profile/playlists";
import ProfileInfo from "../components/profile/profileInfo";
import styles from "../styles/Home.module.css";
import { UserContext } from "../utils/UserContext";

const landing = () => {
  const supabase = useSupabaseClient();
  const user = useContext(UserContext);
  const [playlists, setPlaylists] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase
        .from("playlists")
        .select(
          `
          id, 
          created_at,
          profiles(
            username,
            avatar_url
          ),
          public,
          name,
          likes
        `
        )
        .filter("uid", "eq", user.id);
      if (error) {
        console.log("error getting playlists: ", error);
        return;
      } else {
        setPlaylistLoading(false);
        setPlaylists(data);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className={styles.container}>
      <>
        {user && (
          <>
            <ProfileInfo user={user} />
            {!playlistLoading && (
              <Playlists playlists={playlists} user={user} />
            )}
          </>
        )}
      </>
    </div>
  );
};

export default landing;
