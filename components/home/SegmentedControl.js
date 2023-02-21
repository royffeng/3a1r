import React from "react";

const colors = [
    "bg-micdrop-pink",
    "bg-micdrop-yellow",
    "bg-micdrop-lightpurple"
]

const hoverColors = [
    "hover:!bg-micdrop-pink",
    "hover:!bg-micdrop-yellow",
    "hover:!bg-micdrop-lightpurple"
]

const SegmentedControl = ({ genre, genres, handleGenreChange }) => {
  return (
    <div className="flex justify-center items-center">
      
      {genres.map((genreObj, index) => (
        <div key={index} className= {`px-4 py-2 hover:cursor-pointer ${hoverColors[index % hoverColors.length]} ${genre === genreObj.value ? colors[index % colors.length] : "bg-white"} rounded-full font-lexend border-black border-2 mx-1 font-semibold`} onClick = {() => handleGenreChange(genreObj.value)}>{genreObj.value}</div>
      ))}
    </div>
  );
};

export default SegmentedControl;
