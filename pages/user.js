import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState, useContext, useCallback } from "react";
import Playlists from "../components/profile/playlists";
import ProfileInfo from "../components/profile/profileInfo";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import { UserContext } from "../utils/UserContext";

const Profile = () => {
  const userData = useContext(UserContext);
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [playlists, setPlaylists] = useState(null);
  const [userOfPlaylist, setUserOfPlaylist] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false)
  const [genres, setGenres] = useState(null);

  const id = router.query.id;
  const handleFollow = useCallback(async (currentState) => {
    if(currentState) {
      // remove
      let {data,error} = await supabase
        .from("friends")
        .delete()
        .eq("uid1", userData.id)
        .eq("uid2", id)
      
    } else {
      // add
      let {data,error} = await supabase
        .from("friends")
        .insert({uid1: userData.id, uid2: id})
        .select("*")

      if(error) {
        console.log("error inserting friends", error)
      }
    }
    setIsFollowing(!currentState);
  }, [userData, id]);

  useEffect(() => {
    const fetchPlaylist = async () => {
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
        if (!data.avatar_url.includes("https")) {
          let { data: avatar, error: error } = await supabase.storage
            .from("avatars")
            .download(`${data.avatar_url}`);
          if (error) {
            console.log(error);
          } else {
            const url = URL.createObjectURL(avatar);
            data.avatar_url = url;
          }
        }
        setUserOfPlaylist(data);
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

    const fetchFriends = async () => {
      let{data, error} = await supabase
        .from("friends")
        .select("*")
        .eq("uid1", userData.id)
        .eq("uid2", id);

      if(error) {
        console.log("error getting friends", error)
      } else {
        console.log("friends data", data)
        setIsFollowing(data.length > 0)
      }
    }

    if (id) {
      fetchPlaylist();
      fetchUser();
      fetchGenres();
      if(userData) {
        fetchFriends();
      }
    }
  }, [id, userData]);

  return (
    <div className={`${styles.container}`}>
      {userOfPlaylist && <ProfileInfo user={userOfPlaylist} genres={genres} self={false} isFollowing={isFollowing} setIsFollowing={setIsFollowing} handleFollow={handleFollow}/>}
      {playlists && <Playlists playlists={playlists} personal={false} />}
    </div>
  );
};

export default Profile;
