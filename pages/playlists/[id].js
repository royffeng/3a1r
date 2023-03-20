import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Thumbnail from "../../components/thumbnail";
import { Row, Col } from "react-bootstrap";
import Navbar from "../../components/navbar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ID = ({ searchContext }) => {
  const router = useRouter();
  const { id } = useMemo(() => {
    return router.query;
  }, []);

  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      let { data, error } = await supabase
        .from("playlistHas")
        .select(
          `
            playlists(
              id,
              name,
              profiles(
                id,
                username,
                full_name,
                avatar_url
              ),
              thumbnail_url,
              likes
            ),
            video(
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
            )
          `
        )
        .eq("pid", id);

      if (error) {
        console.log("error getting playlist songs: ", error);
      } else {
        if (!data[0].playlists.profiles.avatar_url.includes("https")) {
          let { data: avatar, error: error } = await supabase.storage
            .from("avatars")
            .download(`${data[0].playlists.profiles.avatar_url}`);
          if (error) {
            console.log("error downloading photo", error);
          } else {
            const url = URL.createObjectURL(avatar);
            data[0].playlists.profiles.avatar_url = url;
            setProfile({ ...data[0].playlists.profiles, avatar_url: url });
          }
        }
        console.log("playlist data", data);
        console.log(
          "This is the author of the playlist",
          data[0].playlists.profiles
        );
        console.log("this is the video", data[0].video);
        setPlaylist(data[0].playlists);
        // console.log([...data.map((item) => item.video)]);
        let videos = [...data.map((item) => item.video)];
        for (let video of [...data.map((item) => item.video)]) {
          if (!video.profiles.avatar_url.includes("https")) {
            let { data: avatar, error: error } = await supabase.storage
              .from("avatars")
              .download(`${video.profiles.avatar_url}`);
            if (error) {
              console.log("error downloading photo", error);
            } else {
              const url = URL.createObjectURL(avatar);
              video.profiles.avatar_url = url;
            }
          }
        }
        setVideos(videos);
      }
    };

    if (id) {
      console.log("here", id);
      fetchPlaylistSongs();
    }
  }, [id]);

  /*
  for liking a playlist
  1. add the pid, uid to the playlistlikes table
  2. increment the likes column in the playlists table
  3. update the state of the playlist frontend

  The above query already fetches the likes of a playlist

  */

  return (
    <div className="">
      <Navbar searchContext={searchContext} />
      <div className="pt-20 px-4">
        <Row className="flex justify-center items-center">
          {playlist && (
            <>
              {" "}
              <Col xl={2} className="flex justify-center items-center">
                <img src={playlist.thumbnail_url} className="rounded-xl" />
              </Col>
              <Col xl={10}>
                <div className="flex flex-col justify-center items-start">
                  <div className="font-bold text-6xl my-2">{playlist.name}</div>
                  <div className="font-semibold text-3xl my-4">
                    public playlist
                  </div>
                </div>
                <div className="my-2">{videos.length} videos</div>
                {profile && (
                  <div className="flex justify-between items-center">
                    <div className="flex justify-center items-center">
                      <img
                        src={profile.avatar_url}
                        className="rounded-full w-10 aspect-square object-cover mr-2"
                      />
                      <div>{profile.username}</div>
                    </div>
                    <div className="flex justify-center items-center">
                      hello
                    </div>
                  </div>
                )}
              </Col>
            </>
          )}
        </Row>
        <div className="w-full h-1 bg-black my-4" />
        <Row>
          {videos.length > 0 &&
            videos.map((video, index) => (
              <Col xl={3} key={index}>
                <Thumbnail
                  id={video.id}
                  username={video.profiles?.username}
                  title={video.title}
                  views={video.views}
                  thumbnail={video.thumbnail}
                  avatar_url={video.profiles?.avatar_url}
                  date={video.created_at}
                  noDate={true}
                  userid={video.profiles?.id}
                />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
};

export default ID;
