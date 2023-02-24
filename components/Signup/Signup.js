import React, { useState } from "react";
import Input from "./Input";
import { Row, Col } from "react-bootstrap";
import Genre from "./Genre";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Signup = () => {
  const supabase = useSupabaseClient();

  const [user, setData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [Genres, setGenres] = useState(new Set([]));

  const submit = async () => {
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (user.password.length < 6) {
      alert("Password must be 6 characters");
      return;
    }

    const { data } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });
  };

  const genres = [
    "pop",
    "r&b",
    "hip-hop",
    "jazz",
    "anime",
    "punk",
    "soul",
    "gospel",
    "disney",
    "tv/movies",
    "country",
    "rock",
    "funk/disco",
    "k-pop",
    "global",
    "indie",
    "other",
  ];

  return (
    <div className="w-11/12 flex justify-center items-start flex-col">
      <p className="text-5xl font-lexend w-full">Create an Account</p>

      <Row className="w-full">
        <Col xl={6}>
          <Input
            values={user}
            value={user.name}
            setData={setData}
            placeholder="Jane Doe"
            name="name"
            type="text"
            label="name"
          />
          <Input
            values={user}
            value={user.email}
            setData={setData}
            placeholder="jane@ucr.edu"
            name="email"
            type="email"
            label="email"
          />
          <Input
            values={user}
            value={user.password}
            setData={setData}
            placeholder=""
            name="password"
            type="password"
            label="password"
          />
          <Input
            values={user}
            value={user.confirmPassword}
            setData={setData}
            placeholder=""
            name="confirmPassword"
            type="password"
            label="Confirm Password"
          />
        </Col>

        <Col xl={6}>
          <Input
            values={user}
            value={user.username}
            setData={setData}
            placeholder="janedoe"
            name="username"
            type="text"
            label="Username"
          />
          <div className="mt-4">
            <p className="font-lexend text-2xl">
              choose your favorite music genres
            </p>
            <Row className="w-full m-0 p-0">
              {genres.map((genre, index) => (
                <Col
                  key={index}
                  className="m-0 p-0 w-fit flex justify-start !max-w-fit items-center"
                >
                  <Genre genre={genre} Genres={Genres} setGenres={setGenres} />
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
      <div className="w-full flex justify-end">
        <button
          onClick={submit}
          className="text-3xl text-black rounded-full px-4 py-2 border-2 border-black hover:bg-black hover:!text-white font-lexend"
        >
          sign up
        </button>
      </div>
    </div>
  );
};

export default Signup;
