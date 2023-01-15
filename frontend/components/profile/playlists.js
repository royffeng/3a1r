import { useMemo, useState, useCallback } from "react";
import { SegmentedControl, Space, Text, Grid } from "@mantine/core";
import Playlist from "./playlist";

const Playlists = ({ playlists }) => {
  const [tab, setTab] = useState("*");
  const [display, setDisplay] = useState(playlists);
  const playlistTabs = useMemo(() => {
    return [
      { value: "*", label: "all" },
      { value: "public", label: "public" },
      { value: "private", label: "private" },
    ];
  });

  const handleTabChange = useCallback((value) => {
    if (value === "public") {
      setDisplay(playlists.filter((playlist) => playlist.public));
    } else if (value === "private") {
      setDisplay(playlists.filter((playlist) => !playlist.public));
    } else {
      setDisplay(playlists);
    }
    setTab(value);
  }, []);
  return (
    <>
      <Space h={32} />
      <Text sx={{ width: "100%", fontSize: "clamp(1rem, 3vw, 3rem)" }}>
        My Playlists
      </Text>
      <Space h={16} />
      {
        <SegmentedControl
          value={tab}
          onChange={(value) => handleTabChange(value)}
          data={playlistTabs}
          color="green"
        />
      }
      <Space h={32} />
      {display && (
        <Grid gutter="md">
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
