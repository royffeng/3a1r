import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import Account from "../components/profile";
import Login from "../components/Login";

const Profile = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const session = useSession();

  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <>
          <Account session={session} />
        </>
      )}
    </>
  );
};

export default Profile;
