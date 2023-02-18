import { useMemo, useState, useCallback } from "react";
import { Space, Text, Grid } from "@mantine/core";
import SegmentedControl from "./SegmentedControl";
import Playlist from "./playlist";

const Playlists = ({ playlists }) => {
  const [display, setDisplay] = useState(playlists);

  return (
    <>
      <Space h={32} />
      <Text sx={{ width: "100%", fontSize: "clamp(1rem, 3vw, 3rem)" }}>
        My Playlists
      </Text>
      <Space h={16} />
      <SegmentedControl setDisplay={setDisplay} playlists = {playlists}/>
      <Space h={32} />
      {display && (
        <Grid gutter="md">
          {display?.map((video, index) => (
            <Grid.Col xs={4} sm={4} md={4} lg={2} key={index}>
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
