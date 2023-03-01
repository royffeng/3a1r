import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useContext, useEffect, useState } from "react";

import Playlists from "../components/profile/playlists";
import ProfileInfo from "../components/profile/profileInfo";
import styles from "../styles/Home.module.css";
import {useRouter} from "next/router"

const Profile = () => {
const router = useRouter()
  const supabase = useSupabaseClient();
  const [playlists, setPlaylists] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(true);

  const id = router.query.id

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
          likes,
          thumbnail_url
        `
        )
        .filter("uid", "eq", id);
      if (error) {
        console.log("error getting playlists: ", error);
        return;
      } else {
        setPlaylistLoading(false);
        setPlaylists(data);
        console.log(data)
      }
    };

    if(id) {
        fetchData()
    }


    
  }, [id]);

  return (
    <div className={styles.container}>
      <>
        {/* {user && (
          <>
            <ProfileInfo user={user} />
            {!playlistLoading && (
              <Playlists playlists={playlists} user={user} />
            )}
          </>
        )} */}
        {
            playlists &&         <Playlists playlists={playlists} />

        }
        
      </>
    </div>
  );
};

export default Profile;
