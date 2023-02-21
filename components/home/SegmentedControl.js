import React from "react";

const colors = [
    "bg-micdrop-pink",
    "bg-micdrop-yellow",
    "bg-micdrop-lightpurple"
]

const SegmentedControl = ({ genres, handleGenreChange }) => {
  return (
    <div className="flex justify-center items-center">
      
      {genres.map((genre, index) => (
        <div key={index} className= {`px-4 py-2 hover:cursor-pointer ${colors[index % colors.length]} rounded-full font-lexend border-black border-2 mx-1 font-semibold`} onClick = {() => handleGenreChange(genre.value)}>{genre.value}</div>
      ))}
    </div>
  );
};

export default SegmentedControl;
