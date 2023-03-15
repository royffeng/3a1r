import React, { useState, useCallback, useMemo } from "react";
import Input from "./Input";
import { Row, Col } from "react-bootstrap";
import Genre from "./Genre";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GENRE_LIST } from "../../utils/genres";
import { useRouter } from "next/router";

const Signup = () => {
  const router = useRouter();
  const genres = useMemo(() => [...GENRE_LIST], [GENRE_LIST]);
  const supabase = useSupabaseClient();

  const [user, setData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedGenres, setGenres] = useState(new Set([]));

  const updateGenres = useCallback(async (userid, genres) => {
    const { error } = await supabase.from("genreLikes").insert([
      ...genres.map((genre) => {
        return { uid: userid, genre: genre };
      }),
    ]);
    if (error) {
      console.log("error updating genres", error);
    } else {
      router.push("/");
    }
  }, []);

  const submit = async () => {
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (user.password.length < 6) {
      alert("Password must be 6 characters");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          username: user.username,
          full_name: user.name,
          avatar_url:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        },
      },
    });
    if (error) {
      console.log("error when signing up:", error);
    } else {
      console.log(data);
      console.log([
        ...genres.map((genre) => {
          return { uid: data.user.id, genre: genre };
        }),
      ]);
      await updateGenres(data.user.id, [...selectedGenres]);
    }
  };

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
                  <Genre
                    genre={genre}
                    Genres={selectedGenres}
                    setGenres={setGenres}
                  />
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
