import Image from "next/image";
import React from "react";
import Microphone from "../public/microphone.png";

const LoginLogo = () => {
  return (
    <div>
      <Image alt={"micdrop logo"} src={Microphone} />
    </div>
  );
};

export default LoginLogo;
