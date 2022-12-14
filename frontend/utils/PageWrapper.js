import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { UserContext } from "../utils/UserContext";


export default function PageWrapper(props) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
        setUserData({
          username: data[0].username,
          full_name: data[0].full_name,
          avatarUrl: avatarUrl
        });
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log("yo");
      // fetchData();
    } else {
      console.log("oy");
    }
  }, [user])


  return (
    <UserContext.Provider value={ user ?
      {id: user?.id, username: userData?.username, full_name: userData?.full_name, avatarUrl: userData?.avatarUrl}
      : null}
    >
      {props.children}
    </UserContext.Provider>
  );
}