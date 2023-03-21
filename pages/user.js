import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Playlists from "../components/profile/playlists";
import ProfileInfo from "../components/profile/profileInfo";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import { VideoGrid } from "../components/home/videoGrid";
import { UserContext } from "../utils/UserContext";

const Profile = ({ searchContext }) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const viewingUser = useContext(UserContext);
  const [playlists, setPlaylists] = useState(null);
  const [user, setUser] = useState(null);
  const [genres, setGenres] = useState(null);
  const [videos, setVideos] = useState(null);
  const [videosLoading, setVideosLoading] = useState(true);
  const [initalFriends, setInitialFriends] = useState(false);

  const id = router.query.id;

  useEffect(() => {
    const fetchPlaylists = async () => {
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
        setPlaylists(data);
      }
    };

    const fetchUser = async () => {
      let { data, error } = await supabase
        .from("profiles")
        .select(
          `
            username, 
            full_name, 
            avatar_url
          `
        )
        .filter("id", "eq", id)
        .single();
      if (error) {
        console.log("error getting profiles: ", error);
        return;
      } else {
        let avatarUrl = null;
        if (!data.avatar_url.includes("https")) {
          let { data: avatar, error: error } = await supabase.storage
            .from("avatars")
            .download(`${data.avatar_url}`);
          if (error) {
            console.log(error);
          } else {
            const url = URL.createObjectURL(avatar);
            avatarUrl = url;
          }
        }
        setUser({ avatarUrl: avatarUrl, ...data });
      }
    };

    const fetchGenres = async () => {
      let { data, error } = await supabase
        .from("genreLikes")
        .select(
          `
            genre
          `
        )
        .filter("uid", "eq", id);
      if (error) {
        console.log("error getting genres: ", error);
        return;
      } else {
        const genres = data.map((element) => element.genre);
        setGenres(genres);
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
        .filter("uid", "eq", id);
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
    const fetchFriends = async () => {
      let { data, error } = await supabase
        .from("friends")
        .select("*")
        .eq("uid1", viewingUser.id)
        .eq("uid2", id);
      if (error) {
        console.log("error getting friends: ", error);
      } else {
        setInitialFriends(data.length > 0);
      }
    };

    if (id) {
      fetchPlaylists();
      fetchUser();
      fetchGenres();
      fetchVideoData();
      if (user) {
        fetchFriends();
      }
    }
  }, [id, viewingUser]);

  const handleAddFriend = useCallback(
    async (oldFriendState, setIsFriends) => {
      if (id) {
        if (oldFriendState) {
          // remove friend
          let { error } = await supabase
            .from("friends")
            .delete()
            .eq("uid1", viewingUser.id)
            .eq("uid2", id)
            .select("*");

          if (error) {
            console.log("error removing friend: ", error);
          } else {
            setIsFriends(false);
          }
        } else {
          // add friend
          let { error } = await supabase
            .from("friends")
            .insert({ uid1: viewingUser.id, uid2: id })
            .select("*");
          if (error) {
            console.log("error adding friend: ", error);
          } else {
            setIsFriends(true);
          }
        }
      }
    },
    [viewingUser, id]
  );

  return (
    <>
      <Navbar searchContext={searchContext} />
      <div className={`${styles.container}`}>
        {user && genres && (
          <ProfileInfo
            user={user}
            genres={genres}
            self={false}
            friends={initalFriends}
            handleAddFriend={handleAddFriend}
          />
        )}
        {playlists && <Playlists playlists={playlists} personal={false} />}
        {!videosLoading && (
          <>
            <p className="text-3xl font-lexend font-semibold m-0">
              Their Videos
            </p>
            <VideoGrid videos={videos} />
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
