import React from "react";
import Navbar from "../components/navbar";

const createplaylist = ({ searchContext }) => {
  return (
    <div>
      <Navbar searchContext={searchContext} />
      <div className="pt-20">CREATE PLAYLIST UI HERE</div>
    </div>
  );
};

export default createplaylist;
