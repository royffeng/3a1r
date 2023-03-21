import { AiFillHeart } from "react-icons/ai";

const Playlist = ({ playlistData }) => {
  return (
    <div className="border-1 border-black p-4 bg-white rounded-3xl w-full h-full flex items-center flex-col">
      <a className="no-underline text-black" href={`/playlists/${playlistData.id}`}>
        <img
          src={playlistData.thumbnail_url}
          className="rounded-2xl aspect-square object-cover"
          alt="playlist thumbnail image"
        />
        <div className="flex justify-between items-center p-2 w-full">
          <p className="text-2xl m-0">{playlistData.name}</p>
          <div className="flex justify-center items-center">
            <p className="text-2xl m-0 mx-1">{playlistData.likes}</p>
            <AiFillHeart className="text-2xl" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default Playlist;
