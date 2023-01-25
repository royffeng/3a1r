import { MantineProvider } from "@mantine/core";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Navbar from "../components/navbar/navbar";
import "../styles/globals.css";
import PageWrapper from "../utils/PageWrapper";

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleDataLoading = () => {
    setUserDataLoading(false);
  };

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          spacing: {
            xs: 4,
            sm: 8,
          },
          colorScheme: "light",
          white: "#F1EAE0",
          fontFamily: "Lexend, sans-serif",
          headings: {
            fontFamily: "Lexend, sans-serif",
          },
          colors: {
            green: [
              "#e5fbf3",
              "#c4eddd",
              "#a0e1c8",
              "#7cd5b2",
              "#58c99c",
              "#40b083",
              "#318865",
              "#226248",
              "#123b2b",
              "#00150c",
            ],
          },
        }}
      >
        <PageWrapper loading={handleDataLoading}>
          {userDataLoading ? (
            <></>
          ) : (
            <>
              <Navbar searchContext={setSearch} />
              <Component search={search} {...pageProps} />
            </>
          )}
        </PageWrapper>
      </MantineProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
