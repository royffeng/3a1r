import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import Account from "../components/profile";

const Profile = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const session = useSession();

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!user ? (
        <Auth
          supabaseClient={supabaseClient}
          providers={["google", "spotify"]}
          appearance={{ theme: ThemeSupa }}
          theme="light"
        />
      ) : (
        <>
          <Account session={session} />
        </>
      )}
    </div>
  );
};

export default Profile;
