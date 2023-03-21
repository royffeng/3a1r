import React, { useState } from "react";

const Genre = ({ genre, isSelected, setGenres }) => {
  const [state, setState] = useState(isSelected);

  const handleToggle = (state) => {
    setState(!state);
    if (!state) {
      setGenres((prev) => new Set([...prev, genre]));
    } else {
      setGenres(
        (prev) =>
          new Set([...prev].filter((genreElement) => genreElement !== genre))
      );
    }
  };

  return (
    <div
      onClick={() => handleToggle(state)}
      className={`${
        state ? "bg-micdrop-pink" : "bg-white"
      } m-0 w-fit hover:!bg-micdrop-pink hover:cursor-pointer whitespace-nowrap rounded-full border-2 border-black font-lexend px-4 py-2`}
    >
      {genre}
    </div>
  );
};

export default Genre;
