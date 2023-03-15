import React from "react";

const colors = [
  "bg-micdrop-purple",
  "bg-micdrop-yellow",
  "bg-micdrop-lightpurple",
];

const hoverColors = [
  "hover:!bg-micdrop-purple",
  "hover:!bg-micdrop-yellow",
  "hover:!bg-micdrop-lightpurple",
];

const SegmentedControl = ({ value, values, handleValue }) => {
  return (
    <div className="flex flex-wrap">
      {values.map((valueObj, index) => (
        <div
          key={index}
          className={`px-4 py-2 mb-2 hover:cursor-pointer ${
            hoverColors[index % hoverColors.length]
          } ${
            value === valueObj.value
              ? colors[index % colors.length]
              : "bg-white"
          } rounded-full font-lexend border-black border-2 mx-1 font-semibold`}
          onClick={() => handleValue(valueObj.value)}
        >
          {valueObj.value}
        </div>
      ))}
    </div>
  );
};

export default SegmentedControl;
