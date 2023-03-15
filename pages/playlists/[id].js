import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Thumbnail from "../../components/thumbnail";
import {Row, Col} from "react-bootstrap"

const ID = () => {
  const router = useRouter();
  const { id } = router.query;

  const supabase = useSupabaseClient();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let songs = 0;
      if (id) {
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
            console.log(songs[i].sid)
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
              videosArr.push(data[0])
          }
          setVideos(videosArr)
        }
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="pt-20 px-4">
      <Row>
      {videos.length > 0 && 
        videos.map((video, index) => (
          <Col xl = {3} key = {index}>
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
