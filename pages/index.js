import Head from "next/head";
import styles from "../styles/Home.module.css";
import Landing from "../components/home/landing";
import { useContext, useEffect } from "react";
import { UserContext } from "../utils/UserContext";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const user = useContext(UserContext);

  useEffect(() => {
    console.log(user)
    if (user === null) {
      router.push("/auth");
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>MicDrop</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="./appicon.png" />
      </Head>
      <main className={`${styles.main}`}>
        <Landing />
      </main>
    </div>
  );
}
