import React from "react";
import { useRouter } from "next/router";

const ID = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  return <div className="pt-20">playlists</div>;
};

export default ID;
