import { useState } from "react";
import { Space, Grid } from "@mantine/core";
import { FiPlus } from "react-icons/fi";
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
      {personal && (
        <SegmentedControl
          setDisplay={setDisplay}
          playlists={playlists}
          personal={false}
        />
      )}
      <Space h={32} />
      {display && (
        <Grid gutter="md">
          {personal && (
            <Grid.Col xs={4} sm={4} md={4} lg={3} key={-1}>
              <div className="border-2 border-black p-4 bg-white rounded-3xl w-full h-full cursor-pointer flex justify-center items-center">
                <Link href="/createplaylist">
                  <div className="w-full h-full">
                    <div className="flex justify-center items-center flex-col bg-micdrop-beige rounded-2xl w-full h-5/6 border-black border-2">
                      <FiPlus className="text-9xl flex content-center" />
                    </div>
                    <div className="flex justify-between items-center p-2 w-full">
                      <p className="text-2xl mb-0 text-center w-full">
                        Create New Playlist
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </Grid.Col>
          )}
          {personal &&
            display.map((video, index) => (
              <Grid.Col
                xs={4}
                sm={4}
                md={4}
                lg={3}
                key={index}
                className="hover:cursor-pointer"
              >
                <Playlist playlistData={video} />
              </Grid.Col>
            ))}
          {!personal &&
            display
              .filter((playlist) => playlist.public === true)
              .map((video, index) => (
                <Grid.Col
                  xs={4}
                  sm={4}
                  md={4}
                  lg={3}
                  key={index}
                  className="hover:cursor-pointer"
                >
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
