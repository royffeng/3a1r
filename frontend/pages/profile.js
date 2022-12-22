import React, { useContext } from "react";
import Playlists from "../components/profile/playlists";
import ProfileInfo from "../components/profile/profileInfo";
import styles from "../styles/Home.module.css";
import { UserContext } from "../utils/UserContext";

const landing = () => {
  const user = useContext(UserContext);
  return (
    <div className={styles.container}>
      <>
        {user && (
          <>
            <ProfileInfo user={user} />
            <Playlists user={user} />
          </>
        )}
      </>
    </div>
  );
};

export default landing;
