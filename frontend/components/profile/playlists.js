import { useMemo, useState, useCallback } from "react";
import { SegmentedControl, Space, Text } from "@mantine/core";

const Playlists = ({ user }) => {
  const [tab, setTab] = useState("*");
  const playlistTabs = useMemo(() => {
    return [
      { value: "*", label: "all" },
      { value: "favorites", label: "favorites" },
      { value: "public", label: "public" },
      { value: "private", label: "private" },
    ];
  });

  const handleTabChange = useCallback((value) => {
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
    </>
  );
};

export default Playlists;
