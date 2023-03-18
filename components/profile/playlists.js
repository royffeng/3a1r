import { useState } from "react";
import { Space, Grid } from "@mantine/core";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import SegmentedControl from "./SegmentedControl";
import Playlist from "./playlist";

const Playlists = ({ playlists, personal = true }) => {
  const [display, setDisplay] = useState(playlists);

  return (
    <>
      <Space h={32} />
      <p className="text-3xl font-lexend font-semibold m-0">
        {personal ? "My" : "Their"} Playlists
      </p>
      <Space h={16} />
      <SegmentedControl setDisplay={setDisplay} playlists={playlists} />
      <Space h={32} />
      {display && (

        <Grid gutter="md">
           <Grid.Col xs={4} sm={4} md={4} lg={3} key={-1}>
              <div className="border-2 border-black p-4 bg-white rounded-3xl w-full h-full cursor-pointer">
                <Link href="https://www.youtube.com/watch?v=4vbDFu0PUew">
                  <div>
                    <FaPlus className="text-9xl items-center"/>
                    <div className="flex justify-between items-center p-2 w-full">
                      <p className="text-2xl m-0">Create New Playlist</p>
                    </div>
                  </div>
                </Link>
              </div>
            </Grid.Col>
          {display?.map((video, index) => (
            <Grid.Col xs={4} sm={4} md={4} lg={3} key={index}>
              <Playlist playlistData={video} />
            </Grid.Col>
          ))}
        </Grid>
      )}
      <Space h={32} />
    </>
  );
};

export default Playlists;
