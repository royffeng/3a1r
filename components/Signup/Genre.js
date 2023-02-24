import React from "react";

const Genre = ({ genre }) => {
  return (
    <div className="bg-white m-0 w-fit whitespace-nowrap rounded-full border-2 border-black font-lexend px-4 py-2">
      {genre}
    </div>
  );
};

export default Genre;
