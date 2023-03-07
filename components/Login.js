import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import LoginLogo from "./LoginLogo";
import { FaGoogle, FaSpotify, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState(false);
  const [message, setMessage] = useState("")

  const handleLogin = async (provider) => {
    setMessage("")
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      redirectTo: "/",
    });

    if (error) {
      alert("Error Signing in with " + provider);
    }
  };

  const handlePasswordLogin = async () => {
    setMessage("")
    const { data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log(data)

    if (data.user === null) {
      setMessage("*invalid email or password")
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen">
      <Row className="h-full">
        <Col
          xl={6}
          className="flex justify-center items-center text-center flex-col border-r-4 border-black"
        >
          <div>
            <LoginLogo />
          </div>
          <p className="m-0 text-6xl mb-2">Welcome to</p>
          <p className="text-8xl m-0 font-bold">micDrop</p>
        </Col>
        <Col
          xl={6}
          className="flex justify-center items-center flex-col m-0 p-0"
        >
          <p className="font-bold text-5xl text-left w-1/2">Log In</p>
          <div className="flex flex-col w-1/2">
            <label htmlFor="email" className="m-0.5 text-xl">
              email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="email"
              className="rounded-full border-2 border-black px-3 py-2.5 font-semibold text-xl outline-none"
            />
          </div>
          <div className="flex flex-col w-1/2 mt-3">
            <label htmlFor="password" className="m-0.5 text-xl">
              password
            </label>
            <div className="rounded-full border-2 border-black px-3 py-2.5 font-semibold text-xl bg-white flex justify-center items-center">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={view ? "text" : "password"}
                name="password"
                placeholder="password"
                className=" outline-none w-full"
              />
              {view ? (
                <FaRegEyeSlash
                  onClick={() => setView(false)}
                  className="hover:cursor-pointer text-2xl"
                />
              ) : (
                <FaRegEye
                  onClick={() => setView(true)}
                  className="hover:cursor-pointer text-2xl"
                />
              )}
            </div>
            <p className="text-red-500 font-lexend font-semibold mb-0 mt-2">
            {message}
            </p>
            
          </div>
          <div className="w-1/2 flex justify-center items-center">
            <div className="w-1/2 bg-white text-black rounded-full border-2 border-black fnot-lexend flex justify-center items-center px-8 py-2 mt-8 text-xl hover:!bg-black hover:!text-white hover:cursor-pointer">
              <Link href="/signup" className="">
                <p className="m-0">signup</p>
              </Link>
            </div>

            <button
              onClick={handlePasswordLogin}
              className="px-8 py-2 rounded-full border-2 border-black hover:!bg-black hover:text-white text-xl mt-8 w-1/2 ml-2 bg-white font-lexend"
            >
              login
            </button>
          </div>
          <div className="w-1/2 mt-4">
            <p className="text-xl text-center">
              or sign in with a social account
            </p>
            <div className="flex justify-center items-center w-full flex-col">
              <div className="flex justify-center items-center w-full">
                <button
                  className="border-2 border-black px-8 py-2 bg-white rounded-full flex justify-center items-center hover:!bg-black hover:text-white text-xl w-1/2 mr-2"
                  onClick={() => handleLogin("google")}
                >
                  <FaGoogle className="mr-2 text-xl" />
                  Google
                </button>
                <button
                  className="border-2 border-black px-8 py-2 bg-white rounded-full flex justify-center items-center hover:!bg-black hover:text-white text-xl w-1/2 ml-2"
                  onClick={() => handleLogin("spotify")}
                >
                  <FaSpotify className="mr-2 text-xl" />
                  Spotify
                </button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
