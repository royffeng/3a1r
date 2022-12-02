import { Auth, Typography, Button } from "@supabase/ui";
import Link from "next/link";

import Layout from "../components/Layout";
import { useAuth, VIEWS } from "../lib/auth";
import { supabase } from "../lib/initSupabase";

const Container = (props) => {
  const { user } = Auth.useUser();
  if (user)
    return (
      <>
        <Typography.Text>Signed in: {user.email}</Typography.Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  return props.children;
};

export default function AuthBasic() {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container supabaseClient={supabase}>
        <Auth supabaseClient={supabase} providers={["google", "spotify"]} />
      </Container>
    </Auth.UserContextProvider>
  );
}
