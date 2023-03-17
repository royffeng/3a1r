import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useContext, useEffect, useState } from "react";

import Playlists from "../components/profile/playlists";
import ProfileInfo from "../components/profile/profileInfo";
import styles from "../styles/Home.module.css";
import { UserContext } from "../utils/UserContext";
import Navbar from "../components/navbar";
import { VideoGrid } from "../components/home/videoGrid";

const Profile = ({ searchContext }) => {
  const supabase = useSupabaseClient();
  const user = useContext(UserContext);
  const [playlists, setPlaylists] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(true);
  const [videos, setVideos] = useState(null);
  const [videosLoading, setVideosLoading] = useState(true);
  useEffect(() => {
    const fetchPlaylistData = async () => {
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
        .filter("uid", "eq", user.id);
      if (error) {
        console.log("error getting playlists: ", error);
        return;
      } else {
        setPlaylistLoading(false);
        setPlaylists(data);
      }
    };
    const fetchVideoData = async () => {
      let { data, error } = await supabase
        .from("video")
        .select(
          `
          id,
          title,
          thumbnail, 
          views,
          created_at,
          profiles(
            id,
            username,
            avatar_url
          )
          `
        )
        .filter("uid", "eq", user.id);
      if (error) {
        console.log("error getting videos: ", error);
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
        setVideos(data);
        setVideosLoading(false);
      }
    };
    if (user) {
      fetchPlaylistData();
      fetchVideoData();
    }
  }, [user]);

  return (
    <>
      <Navbar searchContext={searchContext} />
      <div className={`${styles.container}`}>
        <>
          {user && (
            <>
              <ProfileInfo user={user} />
              {!playlistLoading && <Playlists playlists={playlists} />}
              {!videosLoading && (
                <>
                  <p className="text-3xl font-lexend font-semibold m-0">
                    My Videos
                  </p>
                  <VideoGrid videos={videos} />
                </>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
};

export default Profile;
