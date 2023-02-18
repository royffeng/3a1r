import React from "react";
import { Col, Row } from "react-bootstrap";
import LoginLogo from "./LoginLogo";
import { FaGoogle, FaSpotify } from "react-icons/fa";

const Login = () => {
  return (
    <div className="w-full h-screen">
      <Row className="h-full">
        <Col
          xl={6}
          className="flex justify-center items-center text-center flex-col border-r-8 border-black"
        >
          <div>
            <LoginLogo />
          </div>
          <p className="m-0 text-6xl mb-2">Welcome to</p>
          <p className="text-8xl m-0 font-bold">micDrop</p>
        </Col>
        <Col xl={6} className="flex justify-center items-center flex-col">
          <p className="font-bold text-5xl text-left w-1/2">Log In</p>
          <div className="flex flex-col w-1/2">
            <label htmlFor="email" className="m-0.5 text-xl">
              email
            </label>
            <input
              type="email"
              name="email"
              placeholder="email"
              className="rounded-full border-2 border-black px-3 py-2.5 font-semibold text-xl"
            />
          </div>
          <div className="flex flex-col w-1/2 mt-3">
            <label htmlFor="password" className="m-0.5 text-xl">
              password
            </label>
            <input
              type="password"
              name="password"
              placeholder="password"
              className="rounded-full border-2 border-black px-3 py-2.5 font-semibold text-xl"
            />
          </div>
          <div className="w-1/2 mt-4">
            <p className="text-xl text-center">or sign in with a social account</p>
            <div className="flex justify-evenly items-center w-full">
              <button className="border-2 border-black px-8 py-2 bg-white rounded-full flex hover:!bg-black hover:text-white">
                <FaGoogle className="mr-2"/>
                Google
              </button>
              <button className="border-2 border-black px-8 py-2 bg-white rounded-full flex hover:!bg-black hover:text-white">
                <FaSpotify className="mr-2"/>
                Spotify
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
