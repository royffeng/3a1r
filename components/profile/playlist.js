import { AiFillHeart } from "react-icons/ai";

const Playlist = ({ playlistData }) => {
  return (
    <div className="border-2 border-black p-4 bg-white rounded-3xl w-fit">
      <img src={playlistData.thumbnail_url} className="rounded-2xl" />
      <div className="flex justify-between items-center p-2">
        <p className="text-2xl m-0">{playlistData.name}</p>
        <div className="flex justify-center items-center">
          <p className="text-2xl m-0 mx-1">{playlistData.likes}</p>
          <AiFillHeart className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Playlist;
