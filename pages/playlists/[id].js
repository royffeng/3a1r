import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Thumbnail from "../../components/thumbnail";
import { Row, Col } from "react-bootstrap";

const ID = () => {
  const router = useRouter();
  const { id } = useMemo(() => {return router.query;}, []);

  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
        let {data, error} = await supabase
          .from("playlistHas")
          .select(`
            playlists(
              id,
              profiles(
                id,
                username,
                full_name,
                avatar_url
              ),
              thumbnail_url
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
          `)
          .eq("pid", id)

          if(error) {
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
            console.log("playlist data", data)
            console.log("This is the author of the playlist", data[0].playlists.profiles)
            console.log("this is the video", data[0].video)
            setPlaylist(data[0].playlists);
            // console.log([...data.map((item) => item.video)]);
            let videos = [...data.map((item) => item.video)]
            for(let video of [...data.map((item) => item.video)]) {
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
            setVideos(videos)
          }
    }

    if(id) {
      console.log("here", id)
      fetchPlaylistSongs();
    }
  }, [id])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let songs = 0;
  //     if (id) {
  //       let response = await supabase
  //         .from("playlists")
  //         .select(
  //           `
  //         name,
  //         likes,
  //         thumbnail_url,
  //         uid
  //         `
  //         )
  //         .filter("id", "eq", id)
  //         .limit(1);
  //       let userData = await supabase
  //         .from("profiles")
  //         .select(
  //           `
  //         username,
  //         avatar_url
  //         `
  //         )
  //         .filter("id", "eq", response.data[0].uid)
  //         .limit(1);
  //       setPlaylist(response.data[0]);
  //       // setProfile(userData.data[0]);
  //       if (!userData.data[0].avatar_url.includes("https")) {
  //         let { data: avatar, error: error } = await supabase.storage
  //           .from("avatars")
  //           .download(`${userData.data[0].avatar_url}`);
  //         if (error) {
  //           console.log(error);
  //         } else {
  //           const url = URL.createObjectURL(avatar);
  //           userData.data[0].avatar_url = url;
  //           setProfile({ ...userData.data[0], avatar_url: url });
  //         }
  //       }
  //       let { data, error } = await supabase
  //         .from("playlistHas")
  //         .select(
  //           `
  //           sid
  //         `
  //         )
  //         .filter("pid", "eq", id);
  //       songs = data;
  //       if (error) {
  //         console.log("Error getting playlist songs data: ", error);
  //       } else {
  //         const videosArr = [];
  //         for (let i = 0; i < songs.length; i++) {
  //           console.log(songs[i].sid);
  //           let { data } = await supabase
  //             .from("video")
  //             .select(
  //               `
  //               id,
  //               audiourl,
  //               created_at,
  //               description,
  //               dislikes,
  //               likes,
  //               lyrics,
  //               title,
  //               videourl,
  //               audiourl,
  //               views,
  //               thumbnail,
  //               profiles(
  //                 username,
  //                 avatar_url,
  //                 id
  //               )
  //             `
  //             )
  //             .filter("id", "eq", songs[i].sid);
  //           videosArr.push(data[0]);
  //         }
  //         setVideos(videosArr);
  //         console.log(videosArr)
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  return (
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
                <div className="my-2">{videos.length} videos</div>
              </div>
              {profile && (
                <div className="flex justify-start items-center">
                  <img
                    src={profile.avatar_url}
                    className="rounded-full w-10 aspect-square object-cover mr-2"
                  />
                  <div>{profile.username}</div>
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
  );
};

export default ID;
