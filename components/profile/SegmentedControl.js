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
      <div className = "border-black border-2 w-fit rounded-full">
        <button
          onClick={() => handleTabChange("all")}
          className={`${
            tab == "all" && "bg-micdrop-pink"
          } text-xl px-3 py-1.5 w-fit hover:bg-micdrop-pink font-semibold rounded-l-full border-r-2 border-black`}
        >
          all
        </button>
        <button
          onClick={() => handleTabChange("public")}
          className={`${
            tab == "public" && "bg-micdrop-lightpurple"
          } text-xl px-3 py-1.5 w-fit hover:bg-micdrop-lightpurple font-semibold`}
        >
          public
        </button>
        <button
          onClick={() => handleTabChange("private")}
          className={`${
            tab == "private" && "bg-micdrop-yellow"
          } text-xl px-3 py-1.5 w-fit hover:bg-micdrop-yellow font-semibold rounded-r-full border-l-2 border-black`}
        >
          private
        </button>
      </div>
    </>
  );
};

export default SegmentedControl;
