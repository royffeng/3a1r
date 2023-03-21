import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import Playlists from "../components/profile/playlists";
import ProfileInfo from "../components/profile/profileInfo";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [playlists, setPlaylists] = useState(null);
  const [user, setUser] = useState(null);
  const [genres, setGenres] = useState(null);

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
        setUser(data);
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

    if (id) {
      fetchPlaylists();
      fetchUser();
      fetchGenres();
    }
  }, [id]);

  return (
    <div className={`${styles.container}`}>
      {user && <ProfileInfo user={user} genres={genres} />}
      {playlists && <Playlists playlists={playlists} personal={false} />}
    </div>
  );
};

export default Profile;
