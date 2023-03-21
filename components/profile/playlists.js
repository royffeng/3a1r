import { useState } from "react";
import { Space, Grid } from "@mantine/core";
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
