import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Thumbnail from "../components/thumbnail";
import { Row, Col } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import Navbar from "../components/navbar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const createplaylist = ({ searchContext }) => {
  const router = useRouter();
  const { id } = router.query;

  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let songs = 0;
      if (id) {
        let response = await supabase
          .from("playlists")
          .select(
            `
          name,
          likes,
          thumbnail_url,
          uid
          `
          )
          .filter("id", "eq", id)
          .limit(1);
        let userData = await supabase
          .from("profiles")
          .select(
            `
          username,
          avatar_url
          `
          )
          .filter("id", "eq", response.data[0].uid)
          .limit(1);
        setPlaylist(response.data[0]);
        setProfile(userData.data[0]);
        if (!userData.data[0].avatar_url.includes("https")) {
          let { data: avatar, error: error } = await supabase.storage
            .from("avatars")
            .download(`${userData.data[0].avatar_url}`);
          if (error) {
            console.log(error);
          } else {
            const url = URL.createObjectURL(avatar);
            userData.data[0].avatar_url = url;
            setProfile({ ...userData.data[0], avatar_url: url });
          }
        }
        let { data, error } = await supabase
          .from("playlistHas")
          .select(
            `
            sid
          `
          )
          .filter("pid", "eq", id);
        songs = data;
        if (error) {
          console.log("Error getting playlist songs data: ", error);
        } else {
          const videosArr = [];
          for (let i = 0; i < songs.length; i++) {
            console.log(songs[i].sid);
            let { data } = await supabase
              .from("video")
              .select(
                `
                id,
                audiourl,
                created_at,
                description,
                dislikes,
                likes,
                lyrics,
                title,
                videourl,
                audiourl,
                views,
                thumbnail,
                profiles(
                  username,
                  avatar_url,
                  id
                )
              `
              )
              .filter("id", "eq", songs[i].sid);
            videosArr.push(data[0]);
          }
          setVideos(videosArr);
        }
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Navbar searchContext={searchContext} />
      <div className="pt-20 px-4">
        <Row className="flex justify-center items-center">
          <Col xl={2} className="flex justify-center items-center">
            <div className="w-full h-full">
              <div className="flex justify-center items-center flex-col bg-micdrop-beige rounded-2xl w-full h-5/6 border-black border-2">
                <FaCamera className="text-8xl flex content-center" />
              </div>
            </div>
          </Col>
        </Row>
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

export default createplaylist;
