import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { UserContext } from "../utils/UserContext";

export default function PageWrapper({ loading, children }) {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      let { data, error } = await supabase
        .from("profiles")
        .select(
          `
          avatar_url,
          username,
          full_name
          `
        )
        .filter("id", "eq", user.id);

      if (error) {
        console.log(error);
      } else {
        let avatarUrl = null;
        let genresArray = null;
        if (!data[0].avatar_url.includes("https")) {
          let { data: avatar, error: error } = await supabase.storage
            .from("avatars")
            .download(`${data[0].avatar_url}`);
          if (error) {
            console.log(error);
          } else {
            const url = URL.createObjectURL(avatar);
            avatarUrl = url;
          }
        }
        let { data: genres, error: error } = await supabase
          .from("genreLikes")
          .select(`genre`)
          .filter("uid", "eq", user.id);

        if (error) {
          console.log(error);
        } else {
          genresArray = genres.map((g) => g.genre);
        }
        setUserData({
          username: data[0].username,
          full_name: data[0].full_name,
          avatarUrl: avatarUrl,
          genres: genresArray,
        });
      }

      loading();
    };
    if (user) {
      getUserData();
    } else {
      loading();
    }
    console.log("user changed", user);
  }, [user]);

  return (
    <UserContext.Provider
      value={
        user && userData
          ? {
              id: user?.id,
              username: userData?.username,
              full_name: userData?.full_name,
              avatarUrl: userData?.avatarUrl,
              genres: userData?.genres,
            }
          : null
      }
    >
      {children}
    </UserContext.Provider>
  );
}
