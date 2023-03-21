import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useContext, useEffect, useState, useCallback } from "react";

import Playlists from "../components/profile/playlists";
import ProfileInfo from "../components/profile/profileInfo";
import styles from "../styles/Home.module.css";
import { UserContext } from "../utils/UserContext";
import Navbar from "../components/navbar";

import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const Profile = ({ searchContext }) => {
  const supabase = useSupabaseClient();
  const user = useContext(UserContext);
  const [playlists, setPlaylists] = useState(null);
  const [playlistLoading, setPlaylistLoading] = useState(true);
  const [genres, setGenres] = useState(user.genres);

  const updateGenres = useCallback(
    async (genres) => {
      console.log([
        ...[...genres].map((genre) => {
          return { uid: user.id, genre: genre };
        }),
      ]);

      const { data: currGenres } = await supabase
        .from("genreLikes")
        .select(`genre`)
        .eq("uid", user.id);
      let currGenresSet = new Set(currGenres.map((c) => c.genre));
      let pickedGenresSet = new Set([...genres]);

      const { error } = await supabase.from("genreLikes").insert(
        [...genres]
          .filter((g) => !currGenresSet.has(g))
          .map((genre) => {
            return { uid: user.id, genre: genre };
          })
      );
      if (error) {
        console.log("error updating genres", error);
      } else {
        const { error } = await supabase
          .from("genreLikes")
          .delete()
          .in("uid", [user.id])
          .in(
            "genre",
            [...currGenresSet].filter((g) => !pickedGenresSet.has(g))
          );

        if (error) {
          console.log("error removing genres", error);
        }
        setGenres([...genres]);
      }
    },
    [user]
  );

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
    <>
      <Navbar searchContext={searchContext} />
      <div className={`${styles.container}`}>
        <>
          {user && (
            <>
              <ProfileInfo
                user={user}
                genres={genres}
                updateGenres={updateGenres}
              />
              {!playlistLoading && <Playlists playlists={playlists} />}
            </>
          )}
        </>
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

export default Profile;
