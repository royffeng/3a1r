import React, { useState } from "react";

const SegmentedControl = ({ setDisplay, playlists }) => {
  const [tab, setTab] = useState("all");

  const handleTabChange = (value) => {
    if (value === "public") {
      setDisplay(playlists.filter((playlist) => playlist.public));
    } else if (value === "private") {
      setDisplay(playlists.filter((playlist) => !playlist.public));
    } else {
      setDisplay(playlists);
    }
    setTab(value);
  };

  return (
    <>
      <button
        onClick={() => handleTabChange("all")}
        className={`${
          tab == "all" && "bg-micdrop-green text-white"
        } mr-1 text-xl border-2 border-black px-4 py-2 w-fit rounded-full hover:bg-micdrop-green hover:text-white font-semibold`}
      >
        all
      </button>
      <button
        onClick={() => handleTabChange("public")}
        className={`${
          tab == "public" && "bg-micdrop-green text-white"
        } mx-1 text-xl border-2 border-black px-4 py-2 w-fit rounded-full hover:bg-micdrop-green hover:text-white font-semibold`}
      >
        public
      </button>
      <button
        onClick={() => handleTabChange("private")}
        className={`${
          tab == "private" && "bg-micdrop-green text-white"
        } mx-1 text-xl border-2 border-black px-4 py-2 w-fit rounded-full hover:bg-micdrop-green hover:text-white font-semibold`}
      >
        private
      </button>
    </>
  );
};

export default SegmentedControl;
