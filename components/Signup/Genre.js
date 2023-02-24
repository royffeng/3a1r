import React, { useState } from "react";

const Genre = ({ genre }) => {
  const [state, setState] = useState(false);

  return (
    <div
      onClick={() => setState(!state)}
      className={`${
        state ? "bg-micdrop-pink" : "bg-white"
      } m-0 w-fit hover:!bg-micdrop-pink hover:cursor-pointer whitespace-nowrap rounded-full border-2 border-black font-lexend px-4 py-2`}
    >
      {genre}
    </div>
  );
};

export default Genre;
