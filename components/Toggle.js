import React from "react";

const Toggle = ({ handleValue, value }) => {
  return (
    <div className="flex justify-center items-center border-2 border-black rounded-full">
      <div
        className={`px-4 py-2 rounded-l-full hover:cursor-pointer hover:!bg-micdrop-lightpurple ${
          value === "videos" ? "bg-micdrop-lightpurple" : "bg-white"
        } border-r-2 border-black px-2`}
        onClick={() => handleValue("videos")}
      >
        videos
      </div>
      <div
        className={`px-4 py-2 rounded-r-full hover:cursor-pointer hover:!bg-micdrop-pink ${
          value === "playlists" ? "bg-micdrop-pink" : "bg-white"
        } px-2`}
        onClick={() => handleValue("playlists")}
      >
        playlists
      </div>
    </div>
  );
};

export default Toggle;
