import { useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { AiOutlineCamera, AiOutlineSearch } from "react-icons/ai";
import Navbar from "../components/navbar";
import { UserContext } from "../utils/UserContext";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Thumbnail from "../components/thumbnail";

const CreatePlaylist = ({ searchContext }) => {
  const [title, setTitle] = useState("");
  const [videos, setVideos] = useState([]);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [view, setView] = useState(false);
  const [image, setImage] = useState("");
  const [search, setSearch] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const user = useContext(UserContext);
  const supabase = useSupabaseClient();

  const fetchVideoData = async () => {
    setDataLoading(true);
    let { data, error } = await supabase
      .from("video")
      .select(
        `
          id,
          title,
          thumbnail, 
          views,
          created_at,
          profiles(
              username,
              avatar_url
          )
        `
      )
      .ilike("title", `%${search}%`);
    if (error) {
      console.log(error);
      return;
    } else {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let d = data[i];
        if (!d.profiles.avatar_url.includes("https")) {
          let { data: avatar, error: error } = await supabase.storage
            .from("avatars")
            .download(`${d.profiles.avatar_url}`);
          if (error) {
            console.log(error);
          } else {
            const url = URL.createObjectURL(avatar);
            d.profiles.avatar_url = url;
          }
        }
      }
      setVideos(data);
    }
    setDataLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchContext(search);
    fetchVideoData();
  };

  const handleSelectVideo = (id) => {
    setPlaylistVideos([
      ...playlistVideos,
      videos.filter((element) => element.id === id)[0],
    ]);
  };

  const handleDeselectVideo = (id) => {
    setPlaylistVideos(playlistVideos.filter((element) => element.id !== id));
  };

  const handleCreatePlaylist = async () => {
    const uid = user.id;
    const { data, error } = await supabase
      .from("playlists")
      .insert({
        uid: uid,
        public: toggle,
        name: title,
        likes: 0,
        thumbnail_url: image,
      })
      .select();

    if (error) {
      console.log(error);
    }
    const pid = data[0].id;

    playlistVideos.forEach((video) => {
      const sid = video.id;
      supabase
        .from("playlistHas")
        .insert({
          pid: pid,
          sid: sid,
        })
        .then((response) => console.log(response));
    });
  };

  return (
    <>
      <Navbar searchContext={searchContext} />
      {view && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-opacity-80 w-full h-full bg-micdrop-beige z-[10000000]">
          <div className="border-2 border-black p-4 rounded-xl flex justify-center items-start flex-col w-[50vw] bg-micdrop-beige">
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
              <div className="flex justify-center items-center">
                <button
                  onClick={() => setToggle(false)}
                  className={`${
                    !toggle
                      ? "bg-black text-white"
                      : "bg-micdrop-beige text-black"
                  } px-3 py-2 border-2 border-black rounded-full mx-2`}
                >
                  Private
                </button>
                <button
                  onClick={() => setToggle(true)}
                  className={`${
                    toggle
                      ? "bg-black text-white"
                      : "bg-micdrop-beige text-black"
                  } px-3 py-2 border-2 border-black rounded-full`}
                >
                  Public
                </button>
              </div>
              <p className="mb-0 text-xl my-2">
                {playlistVideos.length} video
                {playlistVideos.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex justify-between items-center w-full">
              <div className="flex justify-center items-center">
                <img src={user.avatarUrl} className="rounded-full w-10 mx-2" />
                <p className="mb-0 text-xl">{user.username}</p>
              </div>
              <button
                onClick={handleCreatePlaylist}
                className="hover:!text-micdrop-green hover:bg-micdrop-beige rounded-full px-4 py-2 font-lexend font-semibold text-2xl border-4 border-micdrop-green bg-micdrop-green text-white"
              >
                save
              </button>
            </div>
          </Col>
        </Row>
        <div className="w-full h-1 bg-black my-4" />
        <div className="w-full flex justify-end items-center">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex justify-center items-center bg-white rounded-md">
              <AiOutlineSearch className="mx-2" />
              <input
                className="rounded-r-md py-2 outline-none font-lexend"
                onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="search songs/artists"
              />
            </div>
          </form>
        </div>
        {dataLoading && <p>No Videos!</p>}
        {!dataLoading && (
          <div className="my-2">
            <Row>
              {videos?.map((video, index) => (
                <Col
                  key={index}
                  xl={3}
                  onClick={() => handleSelectVideo(video.id)}
                >
                  <Thumbnail
                    redirect={false}
                    id={video.id}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    username={video.profiles?.username}
                    views={video.views}
                    avatar_url={video.profiles?.avatar_url}
                    date={video.created_at}
                    userid={video.profiles?.id}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}
        <div className="w-full h-1 bg-black my-4" />
        <div>
          <p className="font-lexend text-2xl">Videos in Playlist</p>
          <Row>
            {playlistVideos?.map((video, index) => (
              <Col
                key={index}
                xl={3}
                onClick={() => handleDeselectVideo(video.id)}
              >
                <Thumbnail
                  redirect={false}
                  id={video.id}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  username={video.profiles?.username}
                  views={video.views}
                  avatar_url={video.profiles?.avatar_url}
                  date={video.created_at}
                  userid={video.profiles?.id}
                />
              </Col>
            ))}
          </Row>
        </div>
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

export default CreatePlaylist;
