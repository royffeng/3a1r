import { supabase } from "../lib/initSupabase";
import { useState, useEffect, useMemo, useRef } from "react";
import { Avatar } from "@mantine/core";
import { rectifyFormat } from "../utils/formatUTC";
import { Button } from "@mantine/core";
import { Divider } from "@mantine/core";
import Video from "../components/karaoke/video";
import "plyr/dist/plyr.css";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import Comments from "../components/karaoke/comment";

export default function Karaoke() {
  const [videoMetaData, setVideoMediaData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let { data, error } = await supabase.from("video").select();
      console.log(data);
      if (error) {
        console.log("error: ", error);
        return;
      } else {
        setVideoMediaData(data[0]);
      }
    };

    fetchData();
  }, []);

  const dateString = useMemo(() => {
    if (videoMetaData) {
      return rectifyFormat(videoMetaData?.created_at);
    }

    return "";
  }, [videoMetaData]);

  const videoViews = useMemo(() => {
    if (videoMetaData) {
      return new Intl.NumberFormat().format(videoMetaData?.views);
    }

    return "0";
  }, [videoMetaData]);

  return (
    <>
      {/* <div style={{width: '640px', height: '360px', display: 'flex', flexDirection: "column",justifyContent: 'start', alignItems: 'start', backgroundColor: 'black'}}>
      </div> */}
      {/* <div style={{display: 'grid'}}> */}
      {/* <div style={{position: 'relative'}}> */}
      <Video />

      {/* </div> */}
      {/* </div> */}
      <div
        style={{
          width: "640px",
          height: "360px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
        }}
      >
        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
          }}
        >
          <p style={{ fontSize: "1.5rem", marginBottom: 0 }}>
            {videoMetaData?.title}
          </p>
        </div>
        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              marginTop: 0,
              marginBottom: 0,
              marginRight: "0.5rem",
            }}
          >
            {dateString}
          </p>
          <p style={{ fontSize: "0.9rem", marginTop: 0, marginBottom: 0 }}>
            {videoViews} views
          </p>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              style={{ marginRight: "0.5rem" }}
              radius="xl"
              alt="no image here"
            />
            <p style={{ margin: 0, marginRight: "0.5rem" }}>Author Username</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              style={{ marginRight: "0.25rem" }}
              color="gray"
              compact
              size="xs"
              variant="light"
              radius="xl"
            >
              <AiFillLike size={12} />
            </Button>
            <p style={{ marginRight: "0.5rem" }}>{120}</p>
            <Button
              style={{ marginRight: "0.25rem" }}
              color="gray"
              compact
              size="xs"
              variant="light"
              radius="xl"
            >
              <AiFillDislike size={12} />{" "}
            </Button>
            <p>{120}</p>
          </div>
        </div>
        <Divider style={{ width: "100%" }} size="sm" />
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          Comments
        </p>
        <Comments />
      </div>
    </>
  );
}
