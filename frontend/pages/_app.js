import "../styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Navbar from "../components/navbar/navbar";

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

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
        }}
      >
        <Navbar />
        <Component {...pageProps} />
      </MantineProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
