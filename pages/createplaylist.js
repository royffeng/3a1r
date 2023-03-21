import { useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { AiOutlineCamera } from "react-icons/ai";
import Navbar from "../components/navbar";
import { UserContext } from "../utils/UserContext";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const createplaylist = ({ searchContext }) => {
  const [title, setTitle] = useState("");
  const [videos, setVideos] = useState([]);
  const [count, setCount] = useState(0);
  const [view, setView] = useState(false);
  const [image, setImage] = useState("");
  const user = useContext(UserContext);

  return (
    <>
      <Navbar searchContext={searchContext} />
      {view && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-opacity-80 w-full h-full bg-micdrop-beige">
          <div className="border-2 border-black p-4 rounded-xl flex justify-center items-start flex-col w-[50vw]">
            <p className="text-2xl font-lexend">add image url</p>
            <input
              type="text"
              name="image"
              placeholder="Insert Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="font-lexend outline-none focus:ring-2 focus:ring-black px-2 py-2 text-xl rounded mb-2 w-full"
            />
            <div className="flex justify-end items-center w-full my-2">
              <button
                className="font-lexend text-xl px-3 py-2 rounded-xl bg-white text-black border-2 border-black hover:!bg-black hover:!text-white font-semibold"
                onClick={() => {
                  setView(false);
                  setImage("");
                }}
              >
                Cancel
              </button>
              <button
                className="font-lexend text-xl px-3 py-2 mx-2 rounded-xl bg-micdrop-green text-white border-micdrop-green border-2 hover:!bg-black hover:!text-white hover:border-black font-semibold"
                onClick={() => {
                  setView(false);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="pt-20 px-4">
        <Row className="flex justify-start items-stretch">
          <Col xl={2} className="flex justify-center items-center">
            <div className="w-full h-full flex">
              {image && (
                <div className="aspect-sqaure w-full">
                  <img src={image} className="rounded-xl" />
                </div>
              )}
              {image === "" && (
                <div
                  className="flex justify-center items-center flex-col bg-white rounded-2xl w-full aspect-square hover:cursor-pointer"
                  onClick={() => setView(true)}
                >
                  <AiOutlineCamera className="text-8xl flex content-center" />
                </div>
              )}
            </div>
          </Col>
          <Col xl={10} className="flex justify-between items-start flex-col">
            <div className="flex justify-center items-start flex-col">
              <input
                type="text"
                value={title}
                name="title"
                placeholder="New Playlist"
                className="text-3xl font-lexend px-2 py-2 mb-2 outline-none focus:ring-2 focus:ring-black rounded"
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="mb-0 text-xl">
                {count} video{count === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex justify-center items-center">
                <img src={user.avatarUrl} className="rounded-full w-10 mx-2" />
                <p className="mb-0 text-xl">{user.username}</p>
              </div>
              <button className="hover:!text-micdrop-green hover:bg-micdrop-beige rounded-full px-4 py-2 font-lexend font-semibold text-2xl border-4 border-micdrop-green bg-micdrop-green text-white">
                save
              </button>
            </div>
          </Col>
        </Row>
        <div className="w-full h-1 bg-black my-4" />
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

export default createplaylist;
